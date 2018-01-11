var stripe = require('stripe')('sk_test_NoGoDFm1sENNGzeWTgE4slzk');
var user_lib = require('./user_lib')



// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
  addStripePayement: _addStripePayement,
  getAllTransactionList: _getAllTransactionList
};


// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

function _getAllTransactionList(userID){
    return new Promise((resolve, reject) => {
        user_lib.get({
          _id: userID
        }).then((user) => {

            if(user.stripeID){
                user_charges = []
                stripe.charges.list(
                    function(err, charges) {
                        charges.data.forEach((charge)=>{
                            if(charge.customer == user.stripeID){
                                if(charge.metadata.date!= null){
                                    console.log(new Date(parseInt(charge.metadata.date)))
                                    charge.date = new Date(parseInt(charge.metadata.date))
                                    user_charges.push(charge)
                                }
                            }
                        })
                        resolve({state:"done", data:user_charges})
                    }
                  ).catch(err=>{
                    resolve({state:"error"})
                  });
            }else{
                resolve({state:"done", data:[]})
            }
        })
    })
}


function _addStripePayement(userId, user_infos, amount) {
  return new Promise((resolve, reject) => {
    return new Promise((resolve, reject) => {
      user_lib.get({
        _id: userId
      }).then((user) => {
        if (user.stripeID) {
          console.log("stripe USER EXIST", user.stripeID)
          stripe.customers.retrieve(
            user.stripeID,
            function (err, customer) {
              console.log("stripe customer", customer)
              stripe.customers.createSource(
                customer.id, {
                  source: user_infos.id
                },
                (err, customer) => {
                  console.log("stripe customer SOURCE", customer)
                  resolve({
                    state: "done",
                    data: user
                  })
                }
              )
            })
        } else {
          console.log("stripe not  EXIST", user.stripeID)
          stripe.customers.create({
            email: user.credentials.email
          }).then(customer => {
            console.log(customer)
            stripe.customers.createSource(
              customer.id, {
                source: user_infos.id
              },
              (err, card) => {
                if (err) {
                  resolve({
                    state: "error",
                    err: err
                  })
                }
                console.log("create stripe user ||", err, customer)
                user.stripeID = customer.id
                user_lib.update(user).then((user) => {
                  console.log(" stripe user update ||", user)
                  resolve({
                    state: "done",
                    data: user
                  })
                })
              })
          })
        }
      })
    }).then((user_update) => {
      if (user_update.state == "done") {
        console.log(" resolve stripe user||", user_update)
        let new_amount = parseInt(amount) / 10
        console.log("NEW AMOUNT", new_amount)
        stripe.charges.create({
          amount: new_amount,
          description: "Sample Charge",
          currency: "eur",
          customer: user_update.data.stripeID,
          metadata: {date:Date.now()
        },
        }).then((charge, err) => {
          if (err) {
            resolve({
              state: "error",
              err: err
            })
          }
          user_update.data.credit += parseInt(amount)
          user_lib.update(user_update.data).then((lastUser) => {
            console.log("  user credit update||", lastUser)
            user_update.data.stripeID
            resolve({
              state: "done",
              data: lastUser
            })
          })
        }).catch((err) => {
          resolve({
            state: "error"
          })
          console.log("ERROR ||", err)
        });
      }else{
        resolve({
            state: "error"
          })
      }
    })
  })
}