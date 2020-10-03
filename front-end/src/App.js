import React, { useState } from 'react';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import './App.css';
import { Col, Row, Container, Form, Button } from 'reactstrap';
import TextField  from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

// import Form from './form';

function App ()  {

  const [comment, setComment] = useState("")
  const [repo_loc, setRepo] = useState("")
  const [local_loc, setLocal] = useState("")
  const [branch, setBranch] = useState("")
  const [prefix, setPrefix] = useState("")
  const [domain, setDomain] = useState("")
  const [folder, setFolder] = useState("")
  const [subfold, setSubfold] = useState("")
  const [username, setUser] = useState("")
  const [password, setPwd] = useState("")
  const [radio1, setRadio1] = useState("No")
  const [radio2, setRadio2] = useState("No")
  const [subdir, setSubdir] = useState("")
  // const [flag, setFlag] = useState(0) 

  function onSubmit(e){
    if (prefix === "" || domain === "" || folder === "" || username === "" || password === ""){
    alert("Prefix,Domain,Folder,Username and Password are the required fields")  
  //   return <Alert severity="warning">
  //   <AlertTitle>Warning</AlertTitle>
  //   Attributes missing
  // </Alert>
    }
    else{
    let array = {
      comment: comment,
      repo_loc: repo_loc,
      local_loc: local_loc,
      subfold: subfold,
      branch: branch,
      prefix: prefix,
      domain: domain,
      folder: folder,
      username: username,
      password: password,
      radio1: radio1,
      radio2: radio2,
      subdir: subdir
    };

    console.log(array);
    fetch("http://localhost:8000/code_mover", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(array)
    })
  .then((resp)=>{ return resp.text() }).then((text)=>{ alert(text)})
}
  }
    return (
      <div style={{backgroundColor:"#0079BE", height:"500px"}}>
        <br/>
      <div class="form" style={{width:"900px", marginLeft:"450px", borderStyle:"solid", borderWidth:"5px", borderColor:"#0079BE"}}>
        <p className="heading" style={{textAlign:"center", height:"65px", paddingTop:"6px"}}> Syn-C-odenous </p>
            <Form style={{marginTop:"5%"}}>
            <TextField 
            style={{width:"50%",marginLeft:"23%"}}  
            color="primary"
            id="comm_id"
            name="comm" 
            variant="outlined"
            label="COMMENT" 
            value = {comment}
            onChange = {(e) => setComment(e.target.value)} />
          <RadioGroup onChange={ setRadio1 } style={{width:"50%", marginLeft:"23%",color:"#000000",marginTop:"12px"}}>
            <RadioButton value="Yes" iconSize={19}>
            {<h6 style={{color:"#000000"}}>Clone from Repo and Extract</h6>}
            </RadioButton>
            <RadioButton value="No" iconSize={19}>
            {<h6 style={{color:"#000000"}}>Default/Extract from local</h6>}
            </RadioButton>
         </RadioGroup>
          {radio1 === "Yes" && (
            <div>
              <TextField
                style={{width:"50%",marginLeft:"23%"}}  
                name="repo_loc" 
                id="repo_loc_id"
                label="REPOSITORY LOCATION" 
                variant="outlined"
                value = {repo_loc}
                onChange = {(e) => setRepo(e.target.value)} />
              <TextField 
                style={{width:"50%",marginLeft:"23%", marginTop:"12px"}}
                name="branch" 
                id="branch_id"
                label="BRANCH NAME" 
                variant="outlined"
                value = {branch} 
                onChange = {(e) => setBranch(e.target.value)}/>
              </div>
          )}
              <TextField
                style={{width:"50%",marginLeft:"23%", marginTop:"12px"}}
                name="local_loc"
                id="local_loc_id"
                label="LOCAL LOCATION" 
                variant="outlined"
                value = {local_loc} 
                onChange = {(e) => setLocal(e.target.value)}/>
          {radio1 === "Yes" && ( 
            <TextField 
            style={{width:"50%",marginLeft:"23%", marginTop:"12px"}}
            name="subfold" 
            id="subfold_id"
            label="FOLDER NAME" 
            variant="outlined"
            value = {subfold} 
            onChange = {(e) => setSubfold(e.target.value)}  
            required /> 
          )}  
              <TextField
                style={{width:"50%",marginLeft:"23%", marginTop:"12px"}}
                name="prefix" 
                id="prefix_id"
                label="FILE PREFIX" 
                variant="outlined"
                value = {prefix} 
                onChange = {(e) => setPrefix(e.target.value)} 
                required />
              <TextField 
                style={{width:"50%",marginLeft:"23%", marginTop:"12px"}}
                name="domain" 
                id="domain_id"
                label="DOMAIN" 
                variant="outlined"
                value = {domain} 
                onChange = {(e) => setDomain(e.target.value)} 
                required />
              <TextField
                style={{width:"50%",marginLeft:"23%", marginTop:"12px"}}
                name="folder" 
                id="folder_id"
                label="PRIMARY DOMAIN FOLDER" 
                variant="outlined"
                value = {folder} 
                onChange = {(e) => setFolder(e.target.value)} 
                required />
              <TextField 
                style={{width:"50%",marginLeft:"23%", marginTop:"12px"}}
                name="user" 
                id="user_id"
                label="USERNAME" 
                variant="outlined"
                value = {username} 
                onChange = {(e) => setUser(e.target.value)}
                required />
              <TextField
                style={{width:"50%",marginLeft:"23%", marginTop:"12px"}}
                name="pwd" 
                id="pwd_id"
                label="PASSWORD" 
                type="password"
                variant="outlined"
                value = {password} 
                onChange = {(e) => setPwd(e.target.value)} 
                password
                required />
          <RadioGroup onChange={ setRadio2 } style={{width:"50%", marginLeft:"23%",color:"#000000",marginTop:"12px"}} >
            <RadioButton value="Yes" iconSize={19} >
            {<h6 style={{color:"#000000"}}>Create Sub-directory and input files</h6>}
            </RadioButton>
            <RadioButton value="No" iconSize={19}>
            {<h6 style={{color:"#000000"}}>Default/location CCLUSERDIR</h6>}
            </RadioButton>
         </RadioGroup>
        {radio2 ==="Yes" && (
          <TextField
                style={{width:"50%",marginLeft:"23%", marginTop:"12px"}}
                name="subdir" 
                id="subdir_id"
                label="SUB-DIRECTORY" 
                variant="outlined"
                value = {subdir} 
                onChange = {(e) => setSubdir(e.target.value)}  
                />
        )}
              <Button
              className="btn btn-primary btn-md"
              style={{ marginLeft: "44%",marginTop:"15px", marginBottom:"20px", backgroundColor:"#0079BE"}}
              size="lg"
              value ="button"
              onClick={ (e) =>onSubmit(e)}
            >
              Submit
            </Button>   
            </Form>
      </div>
      <br/>
      </div>
    );
  }

export default App;
