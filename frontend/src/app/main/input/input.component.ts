import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {Result} from "../../models/result";
import {NgForm} from "@angular/forms";

import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../services/auth.service";
import {ResultService} from "../../services/result.service";
import {conditionallyCreateMapObjectLiteral} from "@angular/compiler/src/render3/view/util";
import {GraphParameters} from "../../models/graph-parameters";
import {makeBindingParser} from "@angular/compiler";
import {isNull} from "@angular/compiler/src/output/output_ast";

type SvgInHtml = HTMLElement & SVGSVGElement;

@Component({
  selector: 'input-section',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements AfterContentInit {

  graphParams = new GraphParameters();
  result: Result = new Result(null, null, null, 1, null);
  graph: HTMLElement;
  size: number;
  animationSnippet: number;
  newPoint = null;
  xValidity = true;
  yValidity = true;
  rValidity = true;

  constructor(
    private authService: AuthService,
    private resultService: ResultService
  ) {
    this.resultService.component = this;
  }

  ngOnInit(): void {
    console.log("init happened");
    // if (this.resultService.getAllResults()) {
    //   setTimeout(() => {
    //     this.drawAllResults();
    //   }, 0);
    // }
  }


  ngAfterContentInit(): void {
    this.graph = document.getElementById("graph-svg");
    this.size = this.graph.getBoundingClientRect().width;
    this.animationSnippet = (this.size - this.size / 6) / 2;
  }

  setX(val) {
    this.result.x = val;
  }

  setY(val) {
    this.result.y = val;
  }

  setR(val) {
    this.result.r = val;
  }

  addResult(form: NgForm) {
    if (!isFinite(this.result.x) || !(-4 <= this.result.x && this.result.x <= 4)) {
      console.log("here");
      this.xValidity = false;
      // return false;
    } else if (!isFinite(this.result.y) || !(-5 <= this.result.y && this.result.y <= 3)) {
      console.log("here");
      this.yValidity = false;
      // return false;
    } else if (!isFinite(this.result.r) || !(-4 <= this.result.r && this.result.r <= 4) || form.invalid) {
      console.log("here");
      this.rValidity = false;
      // return false;
    } else {
      console.log("here");
      this.xValidity = true;
      this.yValidity = true;
      this.rValidity = true;
      this.resultService.saveResult(this.result).then(data => {
        this.drawResult(<Result>data);
        this.resultService.getAllResults();
      }).catch((error: HttpErrorResponse) => {
        console.log("save result error");
        console.log(error.status + error.message);
        // if (error.status === 401 || error.status === 403) {
        //   this.authService.logOut(;
        // }
      })
      return true;
    }
  }


  addResultFromClick(event) {
    this.clicked(event);
    if (this.result.r == null || !(-4 <= this.result.r && this.result.r <= 4)) {
      this.rValidity = false;
      return;
    }
    let curR = this.result.r;
    let canvasX = (this.newPoint.x - this.graphParams.GRAPH_WIDTH / 2) * Math.abs(curR) / (this.graphParams.GRAPH_WIDTH / 2 - this.graphParams.INDENT);
    canvasX = parseFloat(canvasX.toString().substring(0, 5));
    let canvasY = (-this.newPoint.y + this.graphParams.GRAPH_WIDTH / 2) * Math.abs(curR) / (this.graphParams.GRAPH_WIDTH / 2 - this.graphParams.INDENT);
    canvasY = parseFloat(canvasY.toString().substring(0, 5));
    this.result.x = canvasX;
    this.result.y = canvasY;
    if (!isFinite(this.result.x) || !(-4 <= this.result.x && this.result.x <= 4)) {
      console.log("here");
      this.xValidity = false;
      return false;
    } else if (!isFinite(this.result.y) || !(-5 <= this.result.y && this.result.y <= 3)) {
      console.log("here");
      this.yValidity = false;
      return false;
    } else if (!isFinite(this.result.r) || !(-4 <= this.result.r && this.result.r <= 4)) {
      console.log("here");
      this.rValidity = false;
      return false;
    } else {
      console.log("here");
      this.xValidity = true;
      this.yValidity = true;
      this.rValidity = true;
      this.resultService.saveResult(this.result).then(data => {
        this.drawResult(<Result>data);
        this.resultService.getAllResults();
      }).catch((error: HttpErrorResponse) => {
        console.log("save result error");
      })
      return true;
    }
  }

  clearResults() {
    console.log("clear");
    this.clearGraph();
    setTimeout(() => {
      this.resultService.clearResults();
      this.xValidity = true;
      this.yValidity = true;
      this.rValidity = true;
    }, 0);
  }

  drawResult(result: Result) {
    if (result.r != 0) {
      let graphSvg = document.getElementById('graph-svg') as SvgInHtml;
      let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttributeNS(null, 'cx', String(this.graphParams.GRAPH_WIDTH / 2 + (this.graphParams.GRAPH_WIDTH / 2 - this.graphParams.INDENT) * result.x / Math.abs(result.r)));
      circle.setAttributeNS(null, 'cy', String(this.graphParams.GRAPH_WIDTH / 2 - (this.graphParams.GRAPH_WIDTH / 2 - this.graphParams.INDENT) * result.y / Math.abs(result.r)));
      circle.setAttributeNS(null, 'r', String(5));
      circle.setAttribute('data-x', String(result.x));
      circle.setAttribute('data-y', String(result.y));
      circle.classList.toggle("pointer");
      if (this.calculateHit(result.x, result.y, result.r))
        circle.style.fill = "#535cc5";
      else circle.style.fill = "#c553a1";
      graphSvg.appendChild(circle);
    }
  }

  redrawResults(e) {
    this.result.r = e;
    let pointers = document.querySelectorAll(".pointer") as NodeListOf<HTMLElement>;
    for (let i = 0; i < pointers.length; i++) {
      pointers[i].setAttributeNS(null, "r", String(0));
    }
    if (e >= -4 && e <= 4 && e && e != 0) {
      console.log("drawing");
      let pointers = document.querySelectorAll(".pointer") as NodeListOf<HTMLElement>;
      let initX;
      let initY;
      let moveX;
      let moveY;
      for (let i = 0; i < pointers.length; i++) {
        initX = pointers[i].getAttribute("data-x");
        initY = pointers[i].getAttribute("data-y");
        moveX = this.size / 2 + this.animationSnippet * initX / Math.abs(e);
        moveY = this.size / 2 - this.animationSnippet * initY / Math.abs(e);
        if (this.calculateHit(initX, initY, Math.abs(e))) {
          pointers[i].style.fill = "#535cc5";
        } else pointers[i].style.fill = "#c553a1";
        pointers[i].setAttributeNS(null, "cx", String(moveX));
        pointers[i].setAttributeNS(null, "cy", String(moveY));
        pointers[i].setAttributeNS(null, "r", String(5));
      }
    }
  }

  getPoint(e) {
    let graphSvg = document.getElementById('graph-svg') as SvgInHtml;
    let point = graphSvg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    let ctm = graphSvg.getScreenCTM().inverse();
    point = point.matrixTransform(ctm);
    return point;
  }

  clicked(e) {
    let m = this.getPoint(e);
    this.newPoint = m;
  }

  calculateHit(x, y, r) {
    return this.calculateSectionOne(x, y, r) || this.calculateSectionTwo(x, y, r) || this.calculateSectionThree(x, y, r);
  }

  calculateSectionOne(x, y, r) {
    return x >= 0 && y >= 0 && Math.abs(x) <= Math.abs(r) && y <= Math.abs(r) / 2;
  }

  calculateSectionTwo(x, y, r) {
    return x <= 0 && y >= 0 && Math.abs(x) <= Math.abs(r) / 2 && y <= Math.abs(r) && y < (2 * x + Math.abs(r));
  }

  calculateSectionThree(x, y, r) {
    return x >= 0 && y <= 0 && Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) <= Math.abs(r);
  }

  drawAllResults() {
    let pointers = document.querySelectorAll(".pointer") as NodeListOf<HTMLElement>;
    for (let i = 0; i < pointers.length; i++) {
      pointers[i].setAttributeNS(null, "r", String(0));
    }
    // let helper = document.getElementById("helper") as HTMLButtonElement;
    // while (helper.value != "true") {
    //   console.log("waiting");
    // }
    console.log("started drawing");
    let data = Array();
    let table = document.getElementById("result-table") as HTMLTableElement;
    let rows = table.tBodies[0].rows;
    setTimeout(() => {
      for (let i: number = 0; i < rows.length; i++) {
        data[i] = Array();
        for (let j = 0; j < 3; j++) {
          data[i][j] = rows[i].childNodes[j].textContent;
        }
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i][0])
          this.drawResult(new Result(null, data[i][0], data[i][1], this.result.r, null));
      }
    }, 0);
  }

  clearGraph() {
    let pointers = document.querySelectorAll(".pointer");
    for (let i = 0; i < pointers.length; i++) {
      this.graph.removeChild(pointers[i]);
    }
    console.log("cleared");
  }

}
