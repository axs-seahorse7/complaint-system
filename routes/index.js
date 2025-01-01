var express = require('express');
var session = require('express-session')
var sqldb = require('../config/mysql');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/login', function(req, res){
  res.render('login')
});

router.post('/login', function(req, res){
  const {authorID, password} = req.body;
  const sql = 'SELECT * FROM AUTHORITY WHERE AUTHORid = ? and pasword = ?'
  sqldb.query(sql, [authorID, password], (err, result)=>{
    if(err){
      console.log('author is not found', err.message)
      }

    if(result.length === 0){
      return res.status(500)
      .send('invalid username or password')
      }
    const user = result[0]
    console.log(user)
    console.log(user.USERNAME)
    res.redirect('/complaint-files'); 
  })
});

router.get('/complaint', function(req, res, next) {
  res.render('index');
});

router.get('/nav', function(req, res, next) {
  res.render('nav', { title: 'Express' });
});

router.get('/user/submited', function(req, res){
  const username =  req.query.username;
  const complaintID = req.query.ID
  let sql = 'SELECT * FROM complaint WHERE ID = ?';
  sqldb.query(sql,[complaintID], (err, results)=>{
    if(err){  
      console.log('file not submit', err.message);
    }
    res.render('submit', {
      username:username,
      complaint:complaintID
    });
  });
});

router.post('/user-complaint', function(req, res){
  const {username, email, complaint} = req.body;
  const date = Date.now().toString();
  const ID = date.slice(0,10)
  const sql = 'INSERT INTO COMPLAINT (ID, USERNAME, EMAIL, COMPLAINT) VALUES (?,?,?,?)';
  sqldb.query(sql,[ID, username, email, complaint], (err, result)=>{
    if(err){
      console.log('inserting data failed', err.message)
      return;
    }
    console.log('Your complaint succesfully submitted', {ID, username, email, complaint});
    res.redirect(`/user/submited?username=${encodeURIComponent(username)}&ID=${encodeURIComponent(ID)}`);
  });
});

router.get('/user/complaints', (req, res) => {
  const sql = 'SELECT * FROM complaint';
  const countComplaints = 'SELECT COUNT(*) AS totalComplaints FROM COMPLAINT';
  sqldb.query(countComplaints, (err, countResults) => {
      if (err) {
          console.error('Error fetching complaints counting', err.message);
          res.status(500).send('<h2>Error retrieving complaints. Please try again later.</h2>');
          return;
      }
    sqldb.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching complaints:', err.message);
          res.status(500).send('<h2>Error retrieving complaints. Please try again later.</h2>');
          return;
      }
      res.render('complaint', {
        complaints: results,
        totalCount: countResults[0].totalComplaints
      });
    });
  });
});

router.get('/find-complaint', function(req, res){
  res.render('find-complaint')
})

router.get('complaint-files/status', function(req, res){
  let status = req.query;
  let sqldata = 'select * from complaint'

  if(status){
    const status = 'select * from complaint where status = ?';
  }

  sqldb.query(sqldata, status? [status]:[], (err, result)=>{
    if(err){
      console.log('filter is now selected', err.message)
    }

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ complaints: result });
    }

  })
})

router.get('/complaint-files', function(req, res){
  const status = req.query.status;
  let sqldata = 'SELECT * FROM complaint'
  const authorAssets = 'SELECT * FROM authority'
  if(status){
    const status = 'SELECT * FROM complaint WHERE status = ?'
  }

  sqldb.query(authorAssets, (err, result)=>{
    if(err){
      console.log('author Asset not found', err.message)
    }
    sqldb.query(sqldata, status ? [status] : [], (err, results)=>{
      if(err){
        console.log('userdata not found ', err.message)
        res.status(500).send('author assets not found')
      }
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ complaints: results });
      }

      let authorUsername = result[0].USERNAME
      res.render('author',{
          complaints:results,
          author:authorUsername
        });
    });
  });
});

router.get('/findComplaint', function(req, res){
  const complaint = req.query.ID;
  const sqldata = `SELECT * FROM COMPLAINT WHERE ID = ?`;
  sqldb.query(sqldata, [complaint], (err, result)=>{
    if(err){
      console.log('there is some problem')
    }
    res.render('findComplaint', {userComplaint:result[0]})
  })
})

router.post('/fetchComplaint', function(req, res){
  const {complaint} = req.body;
  const sqldata = `SELECT * FROM COMPLAINT WHERE ID = ?`;

  if(!complaint){
    return res.status(400).json({err: 'complaint id not found'})
  }

  sqldb.query(sqldata, [complaint], (err, result)=>{
    if(err){
      return res.status(400).json({err: 'Oops! there is something went wrong!'})
    }
    if(!result || result.length === 0){
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.redirect(`/findComplaint?ID=${encodeURIComponent(complaint)}`);
  })
})

router.put('/complaint/update/:id', function(req, res){
  const complaintID = parseInt(req.params.id)
  console.log('recieved id is :', typeof(complaintID), complaintID)

  const sql = `UPDATE complaint SET status = 'checked' WHERE ID = ? `
  sqldb.query(sql, [complaintID], (err, result)=>{
    if(err){
      return res.status(500).send('err updating status')
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Complaint ID not found');
    }
    res.send('status is updated successfully')
  })
  
})






module.exports = router;
