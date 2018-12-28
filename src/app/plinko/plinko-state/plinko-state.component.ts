import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { PlinkoService } from './../plinko.service';
import { TextStyle, CanvasDimension, AnimationTiming, GameStatus, GameText, HoleNumberList } from './config';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { ThrowStmt } from '@angular/compiler';

declare var PIXI: any;
@Component({
  selector: 'app-plinko-state',
  templateUrl: './plinko-state.component.html',
  styleUrls: ['./plinko-state.component.css']
})

export class PlinkoStateComponent implements OnInit, OnDestroy {

  subscriptionPlace: any;
  subscriptionFinish: any;
  
  readyAssets: boolean;
  spritePramid: any;
  spriteBackgroundTop: any;
  spriteBackgroundBottom: any;

  canvasWidth: number;
  canvasHeight: number;

  timer: any[];

  ghostElement: any;
  
  canvas: any;
  engine: any;
  scene: any;
  camera: any;
  pixiRenderer: any;
  stage: any;

  dice: any[];

  status: any;
  animationStep: number;

  Valpha: number;
  Vbeta: number;

  constructor(public plinkoService: PlinkoService) {
    this.addGhostFontElement();
    this.subscriptionPlace = this.plinkoService.betPlaced.subscribe(status => this.betPlaced(status));
    this.subscriptionFinish = this.plinkoService.roundFinished.subscribe(result => this.roundFinished(result));

  }
  ngOnDestroy() {
    if (this.subscriptionPlace) {
      this.subscriptionPlace.unsubscribe();
      this.subscriptionPlace = null;
    }
        if (this.subscriptionPlace) {
      this.subscriptionPlace.unsubscribe();
      this.subscriptionPlace = null;
    }
    this.removeGhostFontElement();
    this.initializeTimer();
    

    this.spriteBackgroundTop.destroy();
    this.spriteBackgroundTop = null;
    this.spriteBackgroundBottom.destroy();
    this.spriteBackgroundBottom = null;
    
    this.spritePramid.destroy();
    this.spritePramid = null;
    

    PIXI.loader.reset();
  }

  ngOnInit() {
    this.animationStep = 0;
    this.canvasWidth = CanvasDimension.width;
    this.canvasHeight = CanvasDimension.height;

    // babylon.js rendering
    this.canvas = document.getElementById("plinkoStatePanel");

    // babylon.js rendering
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);

    this.camera = new BABYLON.ArcRotateCamera('mainCam', Math.PI / 2, Math.PI / 2, 3,  BABYLON.Vector3.Zero(), this.scene, true);
    // this.camera.attachControl(this.canvas);
    const light1 = new BABYLON.HemisphericLight("hemiLight1", new BABYLON.Vector3(-1, 1, 0), this.scene);
    const light2 = new BABYLON.HemisphericLight("hemiLight2", new BABYLON.Vector3(1, -1, 0), this.scene);
    const envTex = new BABYLON.Texture('assets/plinko/models/white-pixel.png', this.scene);
    
    this.dice = [];
    BABYLON.SceneLoader.ImportMesh("", "assets/plinko/models/", "diceRed.gltf", this.scene,  (newMeshes)  =>{
      // newMeshes[1].material['albedoTexture'] = new BABYLON.Texture("assets/plinko/models/red.png", this.scene, true, false)
      this.dice[0] = newMeshes;
      this.hideDice(0);
    });
    BABYLON.SceneLoader.ImportMesh("", "assets/plinko/models/", "diceGreen.gltf", this.scene,  (newMeshes)  =>{
      this.dice[1] = newMeshes;
      this.hideDice(1);
    });
    BABYLON.SceneLoader.ImportMesh("", "assets/plinko/models/", "diceBlue.gltf", this.scene,  (newMeshes)  =>{
      this.dice[2] = newMeshes;
      this.hideDice(2);
    });

    // pixi.js rendering
    this.pixiRenderer = new PIXI.WebGLRenderer({
      context: this.engine._gl,
      view: this.engine.getRenderingCanvas(),
      width: this.engine.getRenderWidth(),
      height: this.engine.getRenderHeight(),
      clearBeforeRender: false,
      roundPixels: true,
      autoStart: false
    });
    this.stage = new PIXI.Container();



    this.readyAssets = false;
    this.timer = [];
    
    PIXI.loader
      .add('assets/plinko/sprites/pramid.json')
      .add('assets/plinko/sprites/background.json')
      .load((loader, resources) => {
        this.readyAssets = true;

        let frames = [];
        for (let i = 0; i < 60; i++) {
          let val = i < 10 ? '0' + i : i;
    ​      frames.push(PIXI.Texture.fromFrame('./Meantime_Piramid_000' + val));
        }
        this.spritePramid = new PIXI.extras.AnimatedSprite(frames);
        this.spritePramid.animationSpeed = 0.5;
        this.spritePramid.x = this.canvasWidth / 2;
        this.spritePramid.y = this.canvasHeight / 2;
        this.spritePramid.anchor.set(0.5);
        this.spritePramid.loop = false;

        this.spritePramid.onComplete = () => {
          if (this.spritePramid) {
            this.spritePramid.stop();
            this.spritePramid.alpha = 0.0;
            this.playDiceAnimation()
          }
        };

        let frames_back = [];
        for (let i = 0; i < 60; i++) {
          let val = i < 10 ? '0' + i : i;
    ​      frames_back.push(PIXI.Texture.fromFrame('./Background_triangle_000' + val));
        }
        this.spriteBackgroundTop = new PIXI.extras.AnimatedSprite(frames_back);
        this.spriteBackgroundTop.animationSpeed = 0.5;
        this.spriteBackgroundTop.x = this.canvasWidth / 2;
        this.spriteBackgroundTop.y = 0;
        this.spriteBackgroundTop.anchor.set(0.5, 0);
        this.spriteBackgroundTop.loop = true;
        this.spriteBackgroundBottom = new PIXI.extras.AnimatedSprite(frames_back);
        this.spriteBackgroundBottom.animationSpeed = 0.5;
        this.spriteBackgroundBottom.x = this.canvasWidth / 2;
        this.spriteBackgroundBottom.y = this.canvasHeight;
        this.spriteBackgroundBottom.scale.x = -1;
        this.spriteBackgroundBottom.anchor.set(0.5, 1);
        this.spriteBackgroundBottom.loop = true;
        

        this.stage.addChild(this.spriteBackgroundTop);
        this.stage.addChild(this.spriteBackgroundBottom);
        this.stage.addChild(this.spritePramid);
        
        this.spriteBackgroundTop.play();
        this.spriteBackgroundBottom.play();


      });
    
    
    this.timer = [];
    
    this.engine.runRenderLoop(() => {   
      this.updateAll();
      this.pixiRenderer.reset();
      this.pixiRenderer.render(this.stage);
      
      this.scene.autoClear = false;
      this.scene.render();    	
      this.engine.wipeCaches(true);
    });
  }


  updateAll () {
    if (this.animationStep === 1) {
      if (this.camera.radius > CanvasDimension.cameraRadiusMin) {
        this.camera.radius -= 0.1;
      }
      this.camera.alpha += this.Valpha / 15;
      this.camera.alpha %= Math.PI * 2;
      this.camera.beta += this.Vbeta / 25;
      if (this.camera.beta < 0) this.Vbeta = 1;
      if (this.camera.beta > Math.PI) this.Vbeta = -1;
    } else if (this.animationStep === 2) {
      const diffAlpha = HoleNumberList[this.status.dNumber].alpha - this.camera.alpha;
      const diffBeta = HoleNumberList[this.status.dNumber].beta - this.camera.beta;
      let reachedAlpha = false, reachedBeta = false;
      if (Math.abs(diffAlpha) > 1 / 20) {
        this.camera.alpha += diffAlpha/Math.abs(diffAlpha) / 20;
      } else {
        this.camera.alpha = HoleNumberList[this.status.dNumber].alpha;
        reachedAlpha = true;
      }
      if (Math.abs(diffBeta) > 1 / 20) {
        this.camera.beta += diffBeta/Math.abs(diffBeta) / 20;
      } else {
        this.camera.beta = HoleNumberList[this.status.dNumber].beta;
        reachedBeta = true;
      }
      if (reachedAlpha && reachedBeta) {
        this.animationStep = 3;
      }
 
    } else if (this.animationStep === 3) {
      this.timer[0] = setTimeout (()=> {
        this.animationStep = 4;
        clearTimeout(this.timer[0]);
      }, 500);
    } else if (this.animationStep === 4) {
      if (this.camera.radius < CanvasDimension.cameraRadiusMax) {
        this.camera.radius += 0.1;
      } else {
        this.hideDice(-1);
        
      }
    } 
  }
 
  hideDice(diceColor) {
    for (let i = 0; i < 3; i ++) {

      if (i === diceColor || diceColor < 0 || this.dice[i]) {
        this.dice[i][1].visibility = 0;
        this.dice[i][2].visibility = 0;
      }
    }
  }

  showDice(diceColor) {
    this.hideDice(-1);
    this.dice[diceColor][1].visibility = 1;
    this.dice[diceColor][2].visibility = 1;
    
  }


  playAnimation() {
    this.initializeTimer();
    this.spritePramid.gotoAndPlay(1);
  }

  playDiceAnimation () {
    this.showDice(this.status.dColor);
    this.camera.alpha  = Math.random() * Math.PI * 2;
    this.camera.beta  = Math.random() * Math.PI * 2;
    this.camera.radius = CanvasDimension.cameraRadiusMax;
    this.animationStep = 1;
    this.Valpha = 1;
    this.Vbeta = 1;
    console.log(this.camera)
  }


  
  initializeTimer() {
    for (let i = 0; i < this.timer.length; i ++) {
      if (this.timer[i]) {
        clearTimeout(this.timer[i]);
        this.timer[i] = null;
      }
    }

  }

  betPlaced(status) {
    console.log(status)
    
    this.status = status;
    this.animationStep = 0;
    this.hideDice(-1);
    this.spritePramid.alpha = 1.0;
    this.playAnimation();
  }

  roundFinished(result) {
    console.log(result, 'uha')
    this.animationStep = 2;

  }


  addGhostFontElement() {
    this.ghostElement = document.createElement('p');
    this.ghostElement.style.fontFamily = TextStyle.fontFamily;
    this.ghostElement.style.fontSize = "0px";
    this.ghostElement.style.visibility = "hidden";
    this.ghostElement.innerHTML = '.';
    document.body.appendChild(this.ghostElement);
  };

  removeGhostFontElement() {
    if (this.ghostElement) {
      document.body.removeChild(this.ghostElement);
      this.ghostElement = null;
    }
  }

  play() {
    this.plinkoService.placeBet({plinkoType: "blue"});

  }

  success() {
    this.plinkoService.finishRound(50);
  }

  fail() {
    //this.plinkoService.setGameStatus(GameStatus.Fail);
  }
}
