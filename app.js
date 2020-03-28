


const express = require("express");


const session = require("express-session");

const bodyParser = require("body-parser");

const mySqlConnection = require("./db");
 

const app = express();

 


app.set("view engine", "ejs");

 

app.use(express.static("public"));

 

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

 

app.use(

session({

secret: "seCReT",

resave: false,

saveUninitialized: true,

cookie: { maxAge: 360000 }

})

);

 

app.get("/", (req, res) => {

res.render("/index");

});



app.get("/team", (req, res) => {

  res.render("teammem");
  
  });
  


app.get('/dashboard',(req,res)=>{
    if(!req.session.user)
    res.render("login")
 
    else
    {
 var name=req.session.user.name  
 var Em=req.session.user.email
 var Ph=req.session.user.phone 
 var acc=req.session.user.accomodation
 console.log(acc)
  mySqlConnection.query('SELECT event FROM events WHERE name=?',[name],(err,rows)=>{
     if(err)
       console.log(err);
 
     res.render('dashboard',{data:rows,id:name,email:Em,phone:Ph,accom:acc});
   });
 }
 
  });
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 app.get("/login", (req, res) => {
   if (!req.session.user)
     res.render("login")
 
   else res.render("nolog")
 })
 
 
 
 app.get("/codecode", (req, res) => {
 
     res.render("start");
     
     });
 
     app.get("/robowars", (req, res) => {
 
         res.render("robowars");
         
         });
     
 
     app.get("/ted-talks", (req, res) => {
 
         res.render("ted1");
         
         });
 
 app.get("/signup", (req, res) => {
 
         res.render("sign");
         
         });
  
       
         app.get("/accomodation", (req, res) => {
 
          res.render("accom");
          
          });
   
        
         app.get("/npl",(req,res)=>{
          res.render("npl");
        });

 
        
        app.get("/predict2win",(req,res)=>{
          res.render("predict");
        });

        
        app.get("/jam",(req,res)=>{
          res.render("jam");
        });

        app.get("/kbc",(req,res)=>{
          res.render("kbc");
        });
       
 app.post("/submit", (req, res) => {
     const { name,email,psw, phone } = req.body;
     
     let sql = `INSERT INTO registrars(name,email, psw, phone,accomodation) VALUES ?`;
     
     const values = [[name,email, psw, phone,'0']];
     
     mySqlConnection.query(sql, [values], (err, rows) => {
     
     if (err){
     console.log(err);
      res.status(500).send("check aagain");
     }
     else res.redirect("https://stark-ridge-31421.herokuapp.com")
 
     
     });
     
     });
 
 
     app.post("/register",(req,res)=>
 {
   
   if(req.session.user)
   {
 
   
 const{event}=req.body;
 var name=req.session.user.name
 var email=req.session.user.email
 mySqlConnection.query('SELECT * FROM events WHERE name=? and event=?',[name,event],(err,rows)=> {
       
   if(err)
   console.log(err)
   else
   if(rows.length)
       res.render("noreg");
       else
     {
  let sql='INSERT INTO events(name,email,event) VALUES ?';
  const values=[[name,email,event]];
  mySqlConnection.query(sql, [values], (err, rows) => {
     
   if (err){
   console.log(err);
    res.status(500).send("error occured");
   }
   else res.redirect("https://stark-ridge-31421.herokuapp.com/dashboard")
 
   
   });
     }
 
 })}
 else
 res.redirect("https://stark-ridge-31421.herokuapp.com/login");
 
 }
 )
 
 
 app.post("/accomodation",(req,res)=>{

if(req.session.user){
  const{accom}=req.body;
  console.log(accom)
  var name=req.session.user.name;
  mySqlConnection.query('UPDATE registrars SET ? WHERE name = ?', [{ accomodation: accom }, name],(err,rows)=>{
    if(err)
    console.log(err)

    else
    req.session.user.accomodation='1';
    res.redirect("https://stark-ridge-31421.herokuapp.com/dashboard");
  })
 
 }
 else
 res.redirect("https://stark-ridge-31421.herokuapp.com/login")})
 
 app.post("/cancelregister",(req,res)=>
 {console.log("coming");
   
   if(req.session.user)
   {
 
   
 const{event}=req.body;
 var name=req.session.user.name
 mySqlConnection.query('SELECT * FROM events WHERE name=? and event=?',[name,event],(err,rows)=> {
       
   if(err)
   console.log(err)
   else
   if(rows.length)
     {
 mySqlConnection.query('DELETE FROM events WHERE name=? and event=?',[name,event],(err,rows)=> {
 if(err)
 res.redirect(err)
 else
       res.redirect("https://stark-ridge-31421.herokuapp.com/dashboard");
     })}
 
 else
 {
   res.render("unreg");
 }
 
 
 })
 }
 else
 res.redirect("https://stark-ridge-31421.herokuapp.com/login");
 })
 
 
 
 app.post("/login", (req, res) => {
         const { email, password } = req.body
         mySqlConnection.query(
           `SELECT * FROM registrars WHERE email= ?`,[email],
           (err, rows) => {
             if (err) res.status(500).send(err)
             user = rows[0]
             
             if (user) {
               const result = (password==user.psw)
               if (result) { 
                 req.session.user = user;
                 res.redirect('https://stark-ridge-31421.herokuapp.com/dashboard');
 
                
               } else {
             
                 res.render("wrongpass")
               }
             } else {
               
               res.render("wrongemail")
             }
           },
         )
       })
 
       app.get("/logout", (req, res) => {
         if (req.session.user) {
           req.session.destroy(() => {
 
           res.render("logout")
       
           })
         } else {
           res.render("logoutmeme");
         }
       })     



const PORT = process.env.PORT || 5000;

 

app.listen(PORT, console.log(`Server started on port ${PORT}`));