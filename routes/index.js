var express = require('express');
const client = require('../db');
var router = express.Router();
const connection = require('../knexfile')[process.env.NODE_ENV || 'development']
const database = require('knex')(connection)

/* GET home page. */
router.get('/orderNumber', async (req, res) => {
  try {

    await database('GenerateNumber').then(result =>
      res.json({
        status: 200,
        flag: 1,
        data: result
      })
    )
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag: 0
    })
  }
});

//https://tineservicebackendrestapi.azurewebsites.net/orderNumber_last
router.get('/orderNumber_last', async (req, res) => {
  try {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    var new_month = month.length > 1 ? month : "0"+month;  
    var new_day = day.length > 1 ? day : "0"+day;
    var new_year = (""+(year+543)).charAt(2) + (""+(year+543)).charAt(3)
    //console.log(new_year);
    var date_not_day = (year+543) + "-" + new_month;
    var date = year + "-" + new_month + "-" + new_day;
    const value = {
      'signature': 'A'+new_year+new_month,
      'key1': '0',
      'key2': '0',
      'key3': '0',
      'key4': '0',
      'key5': '1',
      'date': date,
      'check': 0
    };
    //console.log(date);
    //console.log(value)
    await database.select('*').from('GenerateNumber').orderBy('create_at', 'desc').limit(1)
      .then(result => {
        //console.log(result.length);
        if (result.length <= 0) {
          database("GenerateNumber")
            .insert(value, 'id')
            .then(function (row) {
              let json_val = [{
                'id': row[0],
                'signature': 'A'+new_year+new_month,
                'key1': '0',
                'key2': '0',
                'key3': '0',
                'key4': '0',
                'key5': '1',
                'date': date,
                'check': 0
              }]
              res.json({
                status: 200,
                flag: 1,
                data: json_val
              })
            })
        } else if (result.length > 0) {
          //let split_date = result[0].date.split('T');
          var parse_date = new Date(result[0].date),
            parse_month = parse_date.getMonth() + 1,
            parse_day = parse_date.getDate(),
            parse_year = parse_date.getFullYear();
          var new_month2 = parse_month.length > 1 ? parse_month : "0"+parse_month;  
          var new_day2 = parse_day.length > 1 ? parse_day : "0"+parse_day;
          var new_year2 = (""+(parse_year+543)).charAt(2) + (""+(parse_year+543)).charAt(3)
          var date_check = (parse_year+543) + "-" +new_month2;
          /*console.log(date_check)
          console.log(date)*/

          if (date_check != date_not_day) {
            database("GenerateNumber")
              .insert(value, 'id')
              .then(function (row) {
                let json_val = [{
                  'id': row[0],
                  'signature': 'A'+new_year+new_month,
                  'key1': '0',
                  'key2': '0',
                  'key3': '0',
                  'key4': '0',
                  'key5': '1',
                  'date': date,
                  'check': 0
                }]
                res.json({
                  status: 200,
                  flag: 1,
                  data: json_val
                })
              })
          } 
        else{
            let sign = result[0].signature;
            let check_key = parseInt(result[0].key1+""+result[0].key2+""+result[0].key3+""+result[0].key4+""+result[0].key5)
            let add_key = check_key + 1;
            //console.log((""+add_key).length)
            if(add_key >= 10000){
              let sign = newKey(result[0].signature);
              database("GenerateNumber")
              .insert(value, 'id')
              .then(function (row) {
                let json_val = [{
                  'id': row[0],
                  'signature': sign+new_year+new_month,
                  'key1': '0',
                  'key2':  '0',
                  'key3': '0',
                  'key4': '0',
                  'key5': '1',
                  'date': date,
                  'check': 0
                }]
                res.json({
                  status: 200,
                  flag: 1,
                  data: json_val
                })
              })
            }
            else if(add_key < 10000){
              var number_key = '';
              if((""+add_key).length == 5){
                number_key = add_key
              }
              else if((""+add_key).length == 4){
                number_key = "0"+add_key
              }
              else if((""+add_key).length == 3){
                number_key = "0"+"0"+add_key
              }
              else if((""+add_key).length == 2){
                number_key = "0"+"0"+"0"+add_key
              }
              else if((""+add_key).length == 1){
                number_key = "0"+"0"+"0"+"0"+add_key
              }
              let value = {
                'signature': result[0].signature,
                'key1': number_key.charAt(0),
                'key2':  number_key.charAt(1),
                'key3': number_key.charAt(2),
                'key4': number_key.charAt(3),
                'key5': number_key.charAt(4),
                'date': date,
                'check': 0
              }
              database("GenerateNumber")
              .insert(value, 'id')
              .then(function (row) {
                let json_val = [{
                  'id': row[0],
                  'signature': result[0].signature,
                  'key1': number_key.charAt(0),
                  'key2':  number_key.charAt(1),
                  'key3': number_key.charAt(2),
                  'key4': number_key.charAt(3),
                  'key5': number_key.charAt(4),
                  'date': date,
                  'check': 0
                }]
                res.json({
                  status: 200,
                  flag: 1,
                  data: json_val
                })
              })
            }
          
         }
        }
      })

  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag: 0
    })
  }
})

router.post('/addOrderNumber', async (req, res) => {
  try {
    const body = req.body
    await database("GenerateNumber").insert(body).then(result =>
      res.json({
        status: 200,
        flag: 1,
        data: result
      })
    )
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag: 0
    })
  }
})

router.put('/updateOrderNumber/:id', async (req, res) => {
  try {
    const body = req.body
    const params = req.params
    await database("GenerateNumber").update(body).where('id', params.id).then(result =>
      res.json({
        status: 200,
        flag: 1,
        data: result
      })
    )
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag: 0
    })
  }
})

router.get('/history', async (req, res) => {
  try {
    await database('CustomerList').leftJoin('History', 'CustomerList.customercode', 'History.customercode')
      .then(result => res.json({
        status: 200,
        flag: 1,
        data: result
      }))
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag: 0
    })
  }
})

router.post('/postHistory', async (req, res) => {
  try {
    const body = req.body
    await database('CustomerList').insert({
      customercode: body.customercode
    }).then(val => {
      database('History').insert(body).then(result =>
        res.json({
          status: 200,
          flag: 1,
          data: result
        })
      )
    })
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag
    })
  }
})

router.get('/', async (req, res) => {
  res.json({
    data: "Hello World"
  })
})

router.get('/invNumber_last', async (req, res) => {
  try {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    var new_month = month.length > 1 ? month : "0"+month;  
    var new_day = day.length > 1 ? day : "0"+day;
    var new_year = (""+(year+543)).charAt(2) + (""+(year+543)).charAt(3)
    //console.log(new_year);
    var date_not_day = (year+543) + "-" + new_month;
    var date = year + "-" + new_month + "-" + new_day;
    const value = {
      'signature': 'INV'+new_year+new_month,
      'key1': '0',
      'key2': '0',
      'key3': '0',
      'key4': '0',
      'key5': '1',
      'date': date,
      'check': 0
    };
    //console.log(date);
    //console.log(value)
    await database.select('*').from('GenerateInv').orderBy('create_at', 'desc').limit(1)
      .then(result => {
        //console.log(result.length);
        if (result.length <= 0) {
          database("GenerateInv")
            .insert(value, 'id')
            .then(function (row) {
              let json_val = [{
                'id': row[0],
                'signature': 'INV'+new_year+new_month,
                'key1': '0',
                'key2': '0',
                'key3': '0',
                'key4': '0',
                'key5': '1',
                'date': date,
                'check': 0
              }]
              res.json({
                status: 200,
                flag: 1,
                data: json_val
              })
            })
        } else if (result.length > 0) {
          //let split_date = result[0].date.split('T');
          var parse_date = new Date(result[0].date),
            parse_month = parse_date.getMonth() + 1,
            parse_day = parse_date.getDate(),
            parse_year = parse_date.getFullYear();
          var new_month2 = parse_month.length > 1 ? parse_month : "0"+parse_month;  
          var new_day2 = parse_day.length > 1 ? parse_day : "0"+parse_day;
          var new_year2 = (""+(parse_year+543)).charAt(2) + (""+(parse_year+543)).charAt(3)
          var date_check = (parse_year+543) + "-" +new_month2;
          /*console.log(date_check)
          console.log(date)*/

          if (date_check != date_not_day) {
            database("GenerateInv")
              .insert(value, 'id')
              .then(function (row) {
                let json_val = [{
                  'id': row[0],
                  'signature': 'INV'+new_year+new_month,
                  'key1': '0',
                  'key2': '0',
                  'key3': '0',
                  'key4': '0',
                  'key5': '1',
                  'date': date,
                  'check': 0
                }]
                res.json({
                  status: 200,
                  flag: 1,
                  data: json_val
                })
              })
          } 
        else{
            let sign = result[0].signature;
            let check_key = parseInt(result[0].key1+""+result[0].key2+""+result[0].key3+""+result[0].key4+""+result[0].key5)
            let add_key = check_key + 1;
            //console.log((""+add_key).length)
            if(add_key >= 10000){
              let sign = newKey(result[0].signature);
              database("GenerateInv")
              .insert(value, 'id')
              .then(function (row) {
                let json_val = [{
                  'id': row[0],
                  'signature': sign+new_year+new_month,
                  'key1': '0',
                  'key2':  '0',
                  'key3': '0',
                  'key4': '0',
                  'key5': '1',
                  'date': date,
                  'check': 0
                }]
                res.json({
                  status: 200,
                  flag: 1,
                  data: json_val
                })
              })
            }
            else if(add_key < 10000){
              var number_key = '';
              if((""+add_key).length == 5){
                number_key = add_key
              }
              else if((""+add_key).length == 4){
                number_key = "0"+add_key
              }
              else if((""+add_key).length == 3){
                number_key = "0"+"0"+add_key
              }
              else if((""+add_key).length == 2){
                number_key = "0"+"0"+"0"+add_key
              }
              else if((""+add_key).length == 1){
                number_key = "0"+"0"+"0"+"0"+add_key
              }
              let value = {
                'signature': result[0].signature,
                'key1': number_key.charAt(0),
                'key2':  number_key.charAt(1),
                'key3': number_key.charAt(2),
                'key4': number_key.charAt(3),
                'key5': number_key.charAt(4),
                'date': date,
                'check': 0
              }
              database("GenerateInv")
              .insert(value, 'id')
              .then(function (row) {
                let json_val = [{
                  'id': row[0],
                  'signature': result[0].signature,
                  'key1': number_key.charAt(0),
                  'key2':  number_key.charAt(1),
                  'key3': number_key.charAt(2),
                  'key4': number_key.charAt(3),
                  'key5': number_key.charAt(4),
                  'date': date,
                  'check': 0
                }]
                res.json({
                  status: 200,
                  flag: 1,
                  data: json_val
                })
              })
            }
          
         }
        }
      })

  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag: 0
    })
  }
})

router.post('/addinvNumber', async (req, res) => {
  try {
    const body = req.body
    await database("GenerateInv").insert(body).then(result =>
      res.json({
        status: 200,
        flag: 1,
        data: result
      })
    )
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag: 0
    })
  }
})

router.put('/updateinvNumber/:id', async (req, res) => {
  try {
    const body = req.body
    const params = req.params
    await database("GenerateInv").update(body).where('id', params.id).then(result =>
      res.json({
        status: 200,
        flag: 1,
        data: result
      })
    )
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag: 0
    })
  }
})

router.get('/billNumber_last', async (req, res) => {
  try {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    var date = year + "-" + month + "-" + day;
    const value = {
      'signature': 'INV001',
      'key1': 'INV',
      'key2': '0',
      'key3': '0',
      'key4': '1',
      'date': date,
      'check': 0
    };
    await database.select('*').from('GenerateBill').orderBy('create_at', 'desc').limit(1)
      .then(result => {
        console.log(result.length);
        if (result.length <= 0) {
          database("GenerateBill")
            .insert(value, 'id')
            .then(function (row) {
              let json_val = [{
                'id': row[0],
                'signature': 'INV001',
                'key1': 'INV',
                'key2': '0',
                'key3': '0',
                'key4': '1',
                'date': date,
                'check': 0
              }]
              res.json({
                status: 200,
                flag: 1,
                data: json_val
              })
            })
        } else if (result.length > 0) {
          //let split_date = result[0].date.split('T');
          var parse_date = new Date(result[0].date),
            parse_month = parse_date.getMonth() + 1,
            parse_day = parse_date.getDate(),
            parse_year = parse_date.getFullYear();
          var date_check = parse_year + "-" + parse_month + "-" + parse_day;
          /*console.log(date_check)
          console.log(date)*/
          if (date_check != date) {
            database("GenerateBill")
              .insert(value, 'id')
              .then(function (row) {
                let json_val = [{
                  'id': row[0],
                  'signature': 'INV001',
                  'key1': 'INV',
                  'key2': '0',
                  'key3': '0',
                  'key4': '1',
                  'date': date,
                  'check': 0
                }]
                res.json({
                  status: 200,
                  flag: 1,
                  data: json_val
                })
              })
          } else{
            let key1 = 'INV';
            let key2 = parseInt(result[0].key2);
            let key3 = parseInt(result[0].key3);
            let key4 = parseInt(result[0].key4);
            if (key2 == 9 && key3 == 9) {
              let genKey = key1 + "01";
              let json_val = {
                'signature': 'INV001',
                'key1': 'INV',
                'key2': '0',
                'key3': '0',
                'key4': '1',
                'date': date,
                'check': 0
              }
              database("GenerateBill")
                .insert(json_val, 'id')
                .then(function (row) {
                  let json_val = [{
                    'id': row[0],
                    'signature': 'INV001',
                    'key1': 'INV',
                    'key2': '0',
                    'key3': '0',
                    'key4': '1',
                    'date': date,
                    'check': 0
                  }]
                  //let json_val = [{ 'id':row[0],  'signature': genKey, 'key1':key1, 'key2':'0' , 'key3':'1', 'date': date, 'check':0 }]
                  res.json({
                    status: 200,
                    flag: 1,
                    data: json_val
                  })
                })
            }
            else if(key2 != 9 && key3 == 9 && key4 == 9){
              let genKey = "INV" + (key2 + 1) + "00",
              genKey2 = "" + (key2+1) ,
              genKey3 = "" + (key3 + 1);
             let json_val = {
              'signature': genKey,
              'key1': 'INV',
              'key2': genKey2,
              'key3': '0',
              'key4': '0',
              'date': date,
              'check': 0
            }
            database("GenerateBill")
              .insert(json_val, 'id')
              .then(function (row) {
                let json_val = [{
                  'id': row[0],
                  'signature': genKey,
                  'key1': 'INV',
                  'key2': genKey2,
                  'key3': '0',
                  'key4': '0',
                  'date': date,
                  'check': 0
                }]
                res.json({
                  status: 200,
                  flag: 1,
                  data: json_val
                })
              })
            }
            else if(key2 != 9 && key3 != 9 && key4 == 9){
              let genKey = 'INV' + "" + key2 +""+(key3+1)+ "0",
              genKey2 = "" + key2 ,
              genKey3 = "" + (key3 + 1);
             let json_val = {
              'signature': genKey,
              'key1': 'INV',
              'key2': genKey2,
              'key3': genkey3,
              'key4': '0',
              'date': date,
              'check': 0
            }
            database("GenerateBill")
              .insert(json_val, 'id')
              .then(function (row) {
                let json_val = [{
                  'id': row[0],
                  'signature': genKey,
                  'key1': 'INV',
                  'key2': genKey2,
                  'key3': genkey3,
                  'key4': '0',
                  'date': date,
                  'check': 0
                }]
                res.json({
                  status: 200,
                  flag: 1,
                  data: json_val
                })
              })
            } else if (key2 != 9 && key3 == 9 && key4 != 9) {
              let genKey = "INV" + (key2 + 1) + "0"+ key4,
                genKey2 = "" + (key2 + 1),
                genKey3 = "" + (key3 + 1),
                genKey4 = "" + key4
              let json_val = {
                'signature': genKey,
                'key1': 'INV',
                'key2': genKey2,
                'key3': '0',
                'key4': genKey4,
                'date': date,
                'check': 0
              }
              database("GenerateBill")
                .insert(json_val, 'id')
                .then(function (row) {
                  let json_val = [{
                    'id': row[0],
                    'signature': genKey,
                    'key1': 'INV',
                    'key2': genKey2,
                    'key3': '0',
                    'key4': genKey4,
                    'date': date,
                    'check': 0
                  }]
                  res.json({
                    status: 200,
                    flag: 1,
                    data: json_val
                  })
                })
            }
            /*else if(key2 == 9 && key3 != 9){
              let genKey = result[0].key1+""+(key2+1)+""+(key3+1),
              genKey2 = ""+(key2+1),
              genKey3 = ""+(key3+1)
              database("GenerateNumber")
              .insert(value, 'id')
              .then(function (row) {
                let json_val = [{ 'id':row[0],  'signature': genKey, 'key1':result[0].key1, 'key2':'0' , 'key3':result[0].key3, 'date': date, 'check':0 }]
                res.json({ status: 200, flag:1 , data: json_val})
              })
            }*/
            else {
              let genKey = "INV" + result[0].key2 + "" + (key3 + 1)+"" + "0",
                genKey2 = "" + (key2 + 1),
                genKey3 = "" + (key3 + 1)
              let json_val = {
                'signature': genKey,
                'key1': result[0].key1,
                'key2': result[0].key2,
                'key3': genKey3,
                'key4': '0',
                'date': date,
                'check': 0
              }

              database("GenerateBill")
                .insert(json_val, 'id')
                .then(function (row) {
                  let json_val = [{
                    'id': row[0],
                    'signature': genKey,
                    'key1': result[0].key1,
                    'key2': result[0].key2,
                    'key3': genKey3,
                    'key4': '0',
                    'date': date,
                    'check': 0
                  }]
                  res.json({
                    status: 200,
                    flag: 1,
                    data: json_val
                  })
                })
            }
          } 
        } else {
          res.json({
            status: 200,
            flag: 1,
            data: result
          })
        }
      })

  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag: 0
    })
  }
})

router.post('/addbillNumber', async (req, res) => {
  try {
    const body = req.body
    await database("GenerateBill").insert(body).then(result =>
      res.json({
        status: 200,
        flag: 1,
        data: result
      })
    )
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag: 0
    })
  }
})

router.put('/updatebillNumber/:id', async (req, res) => {
  try {
    const body = req.body
    const params = req.params
    await database("GenerateBill").update(body).where('id', params.id).then(result =>
      res.json({
        status: 200,
        flag: 1,
        data: result
      })
    )
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
      flag: 0
    })
  }
})


router.get('/getInformationcustomer/:customercode', async (req, res) => {
  try{
    const params = req.params
    await database.select('*').from('InformationCustomerProduct').where('customercode', params.customercode).orderBy('create_at', 'desc')
    .then(result => {
      res.json({ status: 200, data: result , flag: 1})

    })
  }catch(err){
    res.json({ status: 500, message: err, flag: 0})
  }
})

router.post('/addInformationcustomer', async (req, res) => {
  try{
    const body = req.body
   
    await database.select('*').from('InformationCustomerProduct').where('customercode', body.customercode).orderBy('create_at', 'desc').limit(1)
    .then(result => {
      if(result.length <= 0){
        console.log('Yo')
        database('InformationCustomerProduct').insert(body).then(val =>{
          res.json({ status: 200, message: 'success', flag: 1})
        })
      }
      else{
        var parse_date = new Date(),
        parse_month = ""+(parse_date.getMonth() + 1),
        parse_day = ""+parse_date.getDate(),
        parse_year = ""+parse_date.getFullYear();
        var date_check = (parse_year.length > 1 ? parse_year : "0"+parse_year)+ "-" + (parse_month.length > 1 ? parse_month : "0"+parse_month) + "-" +  (parse_day.length > 1 ? parse_day : "0"+parse_day) ;
        if(date_check !=  body.dateprocess){
          database('InformationCustomerProduct').insert(body).then(function(val){
            res.json({ status: 200, message: 'success', flag: 1})
          })
        } 
        else if (date_check ==  body.dateprocess){
          database('InformationCustomerProduct').update(body)
          .where('customercode', body.customercode)
          .andWhere('dateprocess', body.dateprocess)
          .then(val =>{
            res.json({ status: 200, message: 'success', flag: 1})
          })
        }
        else {
          res.json({ status: 200, message: 'success', flag: 1})
        }
      }
    })
  }catch(err){
    res.json({ status: 500, message: err.message, flag: 0})
  }
})

router.put('/updateInformationcustomer/:customercode/:date', async (req, res) => {
  try{
    const body = req.body
    const params = req.params
    await database('InformationCustomerProduct').update(body)
    .where('customercode', params.customercode)
    .andWhere('dateprocess', params.date)
    .then(result=>{
      res.json({ status: 200, message: 'success', flag: 1})
    })
  }catch(err){
    res.json({ status: 500, message: err, flag: 0})
  }
})

router.delete('/delInformationcustomer/:id', async(req, res) =>{
  try{
    const param = req.params
    const id = param.id
    await database('InformationCustomerProduct').where('id', id).del()
    .then(result => {
       res.json({ status: 200, message: 'Success', flag: 1 })
    });
  }catch(err){
    res.json({ status: 500, message: err, flag: 0})
  }
})

function newKey(val) {
  if (val == 'A') {
    return 'B';
  } else if (val == 'B') {
    return 'C';
  } else if (val == 'C') {
    return 'D';
  } else if (val == 'D') {
    return 'E';
  } else if (val == 'E') {
    return 'F';
  } else if (val == 'F') {
    return 'G';
  } else if (val == 'G') {
    return 'H';
  } else if (val == 'H') {
    return 'I';
  } else if (val == 'I') {
    return 'J';
  } else if (val == 'J') {
    return 'K';
  } else if (val == 'K') {
    return 'L';
  } else if (val == 'L') {
    return 'M';
  } else if (val == 'M') {
    return 'N';
  } else if (val == 'N') {
    return 'O';
  } else if (val == 'O') {
    return 'P';
  } else if (val == 'P') {
    return 'Q';
  } else if (val == 'Q') {
    return 'R';
  } else if (val == 'R') {
    return 'S';
  } else if (val == 'S') {
    return 'T';
  } else if (val == 'T') {
    return 'U';
  } else if (val == 'U') {
    return 'V';
  } else if (val == 'V') {
    return 'W';
  } else if (val == 'W') {
    return 'X';
  } else if (val == 'X') {
    return 'Y';
  } else if (val == 'Y') {
    return 'Z';
  } else if (val == 'Z') {
    return 'A';
  }

}

router.get('/profile/:customerId', function (req, res, next) {

});

router.get('/getReport/:datestart/:dateend/:customerId', async (req, res) => {
  try{
    const params = req.params;
    const start = params.datestart
    const end = params.dateend
    const cusId = params.customerId
    console.log(end.length)
    if(start.length < 4 && end.length > 4){
      await database.select('*').from('InformationCustomerProduct').where('customercode', cusId).andWhere('dateprocess', end).orderBy('create_at', 'desc')
      .then(result => {
        res.json({ status: 400, data: result, flag: 1})
      })
    }
    else if(start.length > 4 && end.length < 4){
      await database.select('*').from('InformationCustomerProduct').where('customercode', cusId).andWhere('dateprocess', start).orderBy('create_at', 'desc')
      .then(result => {
        res.json({ status: 400, data: result, flag: 1})
      })
    }else if(start.length > 4 && end.length > 4){
      await database.select('*').from('InformationCustomerProduct').where('customercode', cusId).whereBetween('dateprocess', [start, end]).orderBy('create_at', 'desc')
      .then(result => {
        res.json({ status: 200, data: result, flag: 1})
      })
    }
    else{
      await database.select('*').from('InformationCustomerProduct').where('customercode', cusId).orderBy('create_at', 'desc')
      .then(result => {
        res.json({ status: 200, data: result, flag: 1})
      })
    }
  
  }catch(err){
    res.json({ status: 500, message: err.message, flag: 0})
  }
})



module.exports = router;