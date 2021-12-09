import {Component} from '@angular/core';
import {Result} from "../../models/result";
import {ResultService} from "../../services/result.service";

@Component({
  selector: 'results-section',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  public results: Result[];

  constructor(private resultsService: ResultService) {

  }

  ngOnInit() {
    this.resultsService.results.subscribe(value =>
      this.results = value.sort((res1, res2) => res1.id - res2.id));
    this.resultsService.getAllResults();
  }

}
