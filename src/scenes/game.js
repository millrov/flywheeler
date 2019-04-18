import Phaser from 'phaser';
import flywheeltex from '../assets/egna/act_streetlight_flywheel.png';
import knapptex from '../assets/egna/iphone-home-button.png';
import woodchippertex from '../assets/egna/wood_carving_disk.png';

export default class Game extends Phaser.Scene {
  flywheelRpm = 20;
  flywheelRotPos = 0.0;
  flywheelFricton = 10;

  woodchipperRpm = 0;
  woodchipperRotPos = 0.0;

  fuel = 100;

  burnState = false;
  brakeState = false;
  chutchState = false;

  constructor() {
    super({ key: 'Game' });
  }

  preload() {
    this.load.image('flywheel', flywheeltex);
    this.load.image('woodchipper', woodchippertex);
    this.load.image('knapp', knapptex);
  }

  create() {
    this.burnButton = this.add.sprite(200, 250, 'knapp').setScale(0.1);
    this.brakeButton = this.add.sprite(250, 250, 'knapp').setScale(0.1);
    this.clutchButton = this.add.sprite(300, 250, 'knapp').setScale(0.1);

    this.burnButton.setInteractive();
    this.burnButton.on(
      'pointerdown',
      function() {
        this.burnState = true;
      },
      this
    );
    this.burnButton.on(
      'pointerup',
      function() {
        this.burnState = false;
      },
      this
    );
    this.brakeButton.setInteractive();
    this.brakeButton.on(
      'pointerdown',
      function() {
        this.brakeState = true;
      },
      this
    );
    this.brakeButton.on(
      'pointerup',
      function() {
        this.brakeState = false;
      },
      this
    );
    this.clutchButton.setInteractive();
    this.clutchButton.on(
      'pointerdown',
      function() {
        this.clutch_state = true;
      },
      this
    );
    this.clutchButton.on(
      'pointerup',
      function() {
        this.clutch_state = false;
      },
      this
    );

    this.knapptext = this.add.text(180, 225, 'ÖKA    Bromsa  Koppla');
    this.instrumentering = this.add.text(
      20,
      20,
      'RPM:' +
        this.flywheelRpm +
        ' Fuel:' +
        this.fuel +
        ' Chipper:' +
        this.woodchipperRpm
    );

    this.flywheel = this.add.sprite(100, 120, 'flywheel').setScale(0.2);
    this.woodchipper = this.add.sprite(350, 150, 'woodchipper').setScale(0.05);
  }

  update(time, delta) {
    //setTimeout(1);
    if (this.burnState == true) {
      this.burn();
    }
    if (this.brakeState == true) {
      this.brake();
    }
    if (this.clutch_state == true) {
      this.clutch();
    }
    this.flywheelRpm = this.flywheelRpm * 0.999;
    //console.log(delta);
    if (this.flywheelRpm < 0) {
      this.flywheelRpm = 0;
    }

    this.flywheelRotPos += this.flywheelRpm * delta * 0.01;
    this.flywheel.setAngle(this.flywheelRotPos);
    this.woodchipperRotPos += this.woodchipperRpm * delta * 0.01;
    this.woodchipper.setAngle(this.woodchipperRotPos);

    this.instrumentering.setText(
      'RPM:' +
        this.flywheelRpm.toFixed(0) +
        ' Fuel:' +
        this.fuel.toFixed(0) +
        ' Chipper:' +
        this.woodchipperRpm.toFixed(0)
    );
  }

  burn() {
    console.log('yola');
    //this.instrumentering.setColor(0xFF0000);
    if (this.fuel > 0.1) {
      this.flywheelRpm += 1;
      this.fuel -= 0.1;
    }
  }

  brake() {
    this.flywheelRpm -= 5;
  }

  clutch() {
    if (this.flywheelRpm > 1) {
      this.flywheelRpm -= 1;
      this.woodchipperRpm += 2;
    }
  }
}
