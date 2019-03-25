// import { observable, action, computed, autorun } from 'mobx';
// import agent from '../agent';

// let membershipInfo = observable({
//   fixed_membership_fee: "",
//   fixed_membership_fee_amount: "",
// });

class FlatbondStore {

  // TODO: wanna use observable, but failed too many times.

  // @observable agent = "";
  // @observable fixed_membership_fee_amount = "";

  // constructor() {
  //   autorun(() => {
  //     this.getConfig();
  //   });
  // }

  // getConfig() {
  //   agent.get('https://cxynbjn3wf.execute-api.eu-west-2.amazonaws.com/production/config')
  //     .then((res)=>{
  //       membershipInfo.fixed_membership_fee = res.fixed_membership_fee;
  //       membershipInfo.fixed_membership_fee_amount = res.fixed_membership_fee_amount;
  //     });
  // }

}

export default FlatbondStore;

