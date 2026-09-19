import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-payment-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payment-block.html',
  styleUrl: './payment-block.scss',
})
export class PaymentBlock {}
