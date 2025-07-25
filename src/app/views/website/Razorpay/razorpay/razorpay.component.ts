import { Component, OnInit } from '@angular/core';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { CreateOrderCustomProcessRequest } from 'src/app/classes/infrastructure/razorpay/createorder/createordercustomrequest';
import { CreateOrderResponse } from 'src/app/classes/infrastructure/razorpay/createorder/createorderresponse';
import { VerifyPaymentCustomProcessRequest } from 'src/app/classes/infrastructure/razorpay/verifypayment/verifypaymentcustomrequest';
import { VerifyPaymentResponse } from 'src/app/classes/infrastructure/razorpay/verifypayment/verifypaymentresponse';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
declare var Razorpay: any;


@Component({
  selector: 'app-razorpay',
  templateUrl: './razorpay.component.html',
  styleUrls: ['./razorpay.component.scss'],
})
export class RazorpayComponent  implements OnInit {

  constructor(    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,private uiUtils: UIUtils) { }

  ngOnInit() {}

  startPayment = async ()=>{

    try {


    let amount = 1000;
    let orderId = await this.getOrderIdByAmount(amount);
    if(orderId == '' || orderId == null || orderId == undefined){
      await this.uiUtils.showErrorMessage('Error', 'order Id not generated');
      return
    }

    // open razorpay UI

    const options = {
      key: 'rzp_test_fkXeKmWRxoji8B',
      amount: amount * 100, // in paise
      currency: 'INR',
      name: 'Sagar Patil',
      description: 'Test Transaction',
      order_id: orderId,
      handler: async (response: any) => {
        // Send to backend for verification
      var res =   await this.verifyPayment(response);
      if(res) await this.uiUtils.showSuccessToster( 'Payment Successful.');

      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    await this.uiUtils.showErrorMessage('Error', 'Error occur while generate order');
  }

  }

  getOrderIdByAmount = async (amount:number)=>{

    let req = new CreateOrderCustomProcessRequest();
    // req.TransDateTime = tranDate;
    req.Amount = amount;
    req.EmployeeRef = 29043;

    let td = req.FormulateTransportData();
    let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
    let tr = await this.serverCommunicator.sendHttpRequest(pkt);
    if (!tr.Successful) {
      await this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    }
    let tdResult = JSON.parse(tr.Tag) as TransportData;
    let res = CreateOrderResponse.FromTransportData(tdResult);
    if(res.Rows.length > 0){
      let orderId = res.Rows[0].OrderId;
      return orderId;
    }
    return "";
  }
  verifyPayment = async (response:any)=>{

    let req = new VerifyPaymentCustomProcessRequest();
    // req.TransDateTime = tranDate;
    req.PaymentId = response.razorpay_payment_id ;
    req.OrderId = response.razorpay_order_id  ;
    req.Signature = response.razorpay_signature  ;
    let td = req.FormulateTransportData();
    let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
    let tr = await this.serverCommunicator.sendHttpRequest(pkt);

    if (!tr.Successful) {
      await this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    }
    let tdResult = JSON.parse(tr.Tag) as TransportData;
    let res = VerifyPaymentResponse.FromTransportData(tdResult);

    return tr.Successful;
  }



}
