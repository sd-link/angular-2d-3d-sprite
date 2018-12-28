import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { PlinkoService } from './../plinko.service';
import { TextStyle, CanvasDimension, AnimationTiming, GameStatus, GameText } from './config';
import * as BABYLON from 'babylonjs';

declare var PIXI: any;
@Component({
  selector: 'app-plinko-state',
  templateUrl: './plinko-state.component.html',
  styleUrls: ['./plinko-state.component.css']
})
export class PlinkoStateComponent implements OnInit, OnDestroy {

  subscription: any;
  
  readyAssets: boolean;
  spritePramid: any;
  spriteBackgroundTop: any;
  spriteBackgroundBottom: any;

  canvasWidth: number;
  canvasHeight: number;

  
  

  timer: any[];

  ghostElement: any;
  
  canvas: any;

  constructor(public plinkoService: PlinkoService) {
    this.addGhostFontElement();
    this.subscription = this.plinkoService.betPlaced.subscribe(status => this.betPlaced(status));
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
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

    this.canvasWidth = CanvasDimension.width;
    this.canvasHeight = CanvasDimension.height;

    // babylon.js rendering
    this.canvas = document.getElementById("plinkoStatePanel");

    // babylon.js rendering
    var engine = new BABYLON.Engine(this.canvas, true);
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(this.canvas, true);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere1", {diameter: 2}, scene);
    sphere.material = new BABYLON.StandardMaterial("earth", scene);
    sphere.rotation.x = Math.PI;
    sphere.position.x = -1;
    sphere.position.y = -1;

    // pixi.js rendering
    var pixiRenderer = new PIXI.WebGLRenderer({
      context: engine._gl,
      view: engine.getRenderingCanvas(),
      width: engine.getRenderWidth(),
      height: engine.getRenderHeight(),
      clearBeforeRender: false,
      roundPixels: true,
      autoStart: false
    });
    var stage = new PIXI.Container();



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
        

        stage.addChild(this.spriteBackgroundTop);
        stage.addChild(this.spriteBackgroundBottom);
        stage.addChild(this.spritePramid);
        
        this.spriteBackgroundTop.play();
        this.spriteBackgroundBottom.play();


      });
    
    
    engine.runRenderLoop(function() {   
      pixiRenderer.reset();
      pixiRenderer.render(stage);
      
      scene.autoClear = false;
      // sphere.rotation.y += 0.01;
      scene.render();    	
      engine.wipeCaches(true);
    
      
      
    });
  }
 



  playAnimation() {
    this.initializeTimer();
    this.spritePramid.gotoAndPlay(1);
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
    console.log('lsdfkjsd')
    this.spritePramid.alpha = 1.0;
    this.playAnimation();
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
    //this.plinkoService.setGameStatus(GameStatus.Success);
  }

  fail() {
    //this.plinkoService.setGameStatus(GameStatus.Fail);
  }
}
