import Phaser from "phaser";
import flywheeltex from "../assets/egna/act_streetlight_flywheel.png";
import knapptex from "../assets/egna/iphone-home-button.png";
import woodchippertex from "../assets/egna/wood_carving_disk.png";
import { get } from "http";

export default class Game extends Phaser.Scene {
  fuel = 1000;

  burnState = false;
  brakeState = false;
  clutchState = false;
  connectedFlywheels = [];

  constructor() {
    super({ key: "Game" });
  }

  preload() {
    this.load.image("flywheel", flywheeltex);
    this.load.image("woodchipper", woodchippertex);
    this.load.image("knapp", knapptex);
  }

  create() {
    this.flywheels = this.add.group(
      [
        this.createFlywheel(100, 120, 0.2, "flywheel", 20, 0.0, 10, 100, 1000),
        this.createFlywheel(350, 150, 0.05, "woodchipper", 5, 0.0, 10, 20, 500)
      ]
      //x,y,sc,tex,rpm,rot,fri,mass,eny
    );
    this.burnButton = this.add.sprite(100, 250, "knapp").setDisplaySize(30, 30);
    this.brakeButton = this.add.sprite(200, 250, "knapp").setScale(0.1);
    this.clutchButton = this.add.sprite(300, 250, "knapp").setScale(0.2);

    this.burnButton.setInteractive();
    this.burnButton.on(
      "pointerdown",
      function() {
        this.burnState = true;
      },
      this
    );
    this.burnButton.on(
      "pointerup",
      function() {
        this.burnState = false;
      },
      this
    );
    this.brakeButton.setInteractive();
    this.brakeButton.on(
      "pointerdown",
      function() {
        this.brakeState = true;
      },
      this
    );
    this.brakeButton.on(
      "pointerup",
      function() {
        this.brakeState = false;
      },
      this
    );
    this.clutchButton.setInteractive();
    this.clutchButton.on(
      "pointerdown",
      function() {
        if (this.clutchState == false) {
          enyDiff =
            this.flywheels.getChildren()[0].getData("eny") -
            this.flywheels.getChildren()[1].getData("eny");
        }
        this.tween = this.tweens.addCounter({
          from: 0,
          to: enyDiff,
          duration: 2000
        });
       
        this.clutchState = true;
      },
      this
    );
    this.clutchButton.on(
      "pointerup",
      function() {
        this.clutchState = false;
      },
      this
    );

    //this.knapptext = this.add.text(180, 225, "Burn Brake Clutch");
    this.instrumentering = this.add.text(20, 20, "");
  }

  update(time, delta) {
    if (this.burnState == true) {
      this.burn(0);
    }
    if (this.brakeState == true) {
      this.brake(0);
    }
    if (this.clutchState == true) {
      this.clutch();
    }

    const ch = this.flywheels.getChildren();

    for (let i = 0; i < 2; i++) {
      ch[i].setData(
        "eny",
        ch[i].getData("eny") * (1 - ch[i].getData("fri") / 100000)
      );

      ch[i].setData("rpm", ch[i].getData("eny") / ch[i].getData("mass"));

      ch[i].setData(
        "rot",
        ch[i].getData("rot") + ch[i].getData("rpm") * delta * 0.01
      );
      ch[i].setAngle(ch[i].getData("rot"));

      if (ch[i].getData("eny") < 0) {
        ch[i].setData("eny", 0);
      }
    }

    this.instrumentering.setText(
      "ENY:" +
        ch[0].getData("eny").toFixed(0) +
        " RPM:" +
        ch[0].getData("rpm").toFixed(0) +
        " Fuel:" +
        this.fuel.toFixed(0) +
        " CENY:" +
        ch[1].getData("eny").toFixed(0) +
        " CRPM:" +
        ch[1].getData("rpm").toFixed(0)
    );
  }

  burn(n) {
    if (this.fuel > 0.1) {
      this.flywheels
        .getChildren()
        [n].setData("eny", this.flywheels.getChildren()[n].getData("eny") + 10);
      this.fuel -= 0.1;
    }
  }

  brake(n) {
    if (this.flywheels.getChildren()[n].getData("eny") > 0.1) {
      this.flywheels
        .getChildren()
        [n].setData("eny", this.flywheels.getChildren()[n].getData("eny") - 25);
    }
  }

  clutch() {
    /*     const fly1 = this.flywheels.getChildren()[0];
    const fly2 = this.flywheels.getChildren()[1];
    this.connect(
      fly1,
      fly2
    ); */
    this.energyLeveling(this.tween.getValue());
  }

  createFlywheel(x, y, sc, tex, rpm, rot, fri, mass, eny) {
    const flywheel = this.add.sprite(x, y, tex).setScale(sc);
    flywheel.setData("rpm", rpm);
    flywheel.setData("rot", rot);
    flywheel.setData("fri", fri);
    flywheel.setData("mass", mass);
    flywheel.setData("eny", eny);
    return flywheel;
  }

  connect(fly1, fly2) {
    this.connectedFlywheels = [fly1, fly2];
  }

  energyLeveling(procent) {

    let halva =
      (this.flywheels.getChildren()[0].getData("eny") +
        this.flywheels.getChildren()[1].getData("eny")) /
      2;

    this.flywheels.getChildren()[0].setData("eny", halva);
    this.flywheels.getChildren()[1].setData("eny", halva);

    //return halva;

    //if (this.connectedFlywheels.length<1) {return 0};
    //console.log("energyLeveling");

    //return this.connectedFlywheels.reduce((total, fly) => {
    // return total + fly.getData("eny");
    //});
  }
}
