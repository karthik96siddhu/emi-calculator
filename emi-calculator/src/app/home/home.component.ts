import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'ng2-charts-demo';

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Principal', 'Interest'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#3b82f6', '#facc15'],
        hoverBackgroundColor: ['#2563eb', '#eab308'],
        borderWidth: 1,
      }
    ]
  };
  
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };
  public loanForm!: FormGroup;
  emi: number = 0;
  totalInterest: number = 0;
  totalPayment: number = 0;

  constructor(private _fb : FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    // this.loanForm = this._fb.group({
    //   principal: ['', [Validators.required, Validators.min(1000), Validators.max(10000000)]],
    //   interest: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
    //   tenure: ['', [Validators.required, Validators.min(1), Validators.max(30)]],
    // })
   }

   ngOnInit(): void {
    this.loanForm = this._fb.group({
      principal: [500000],
      interest: [7.5],
      tenure: [5]
    });

    this.loanForm.valueChanges
    .pipe(
      debounceTime(100), // Small delay to avoid excessive calculations
      distinctUntilChanged()
    )
    .subscribe(values => {
      console
      this.calculateEMI(values);
    });

    this.calculateEMI(this.loanForm.value);
  }


  onSliderChange(controlName: string, event: any) {
    const newValue = event.value;
    this.loanForm.get(controlName)?.setValue(newValue);
  }

  calculateEMI(values: any) {
    const P = values.principal;
    const r = values.interest / 12 / 100;
    const n = values.tenure * 12;

    this.emi = Math.round(P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));

    this.totalPayment = this.emi * n;
    this.totalInterest = this.totalPayment - P;

    this.doughnutChartData = {
      labels: ['Principal', 'Interest'],
      datasets: [
        {
          data: [P, this.totalInterest],
          backgroundColor: ['#3b82f6', '#facc15'],
          hoverBackgroundColor: ['#2563eb', '#eab308'],
          borderWidth: 1
        }
      ]
    };

  }

}
