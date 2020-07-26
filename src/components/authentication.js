import React, {useState, useRef} from 'react';
import axios from 'axios';
import './authentication.css';

axios.defaults.withCredentials = true; 

function Authentication(){

    const [loginForm, setLoginForm] = useState( {email: '', password: ''} );
    const [registerForm, setRegisterForm] = useState( {email: '', password: ''} );
    const log = useRef();
    const reg = useRef();
    const button = useRef();

    function registerButton(){
        log.current.style.left = "-400px";
        reg.current.style.left = "50px";
        button.current.style.left = "110px";
    }
    function loginButton(){
        log.current.style.left = "50px";
        reg.current.style.left = "450px";
        button.current.style.left = "0px";
    }

    function handleChange(e){
        const name = e.target.name;
        const value = e.target.value;
		switch(name){
			case 'email':
				setLoginForm({ email: value, password: loginForm.password });
				break;
			case 'password':
				setLoginForm({ email: loginForm.email, password: value });
				break;
			default:
				console.log('erreur !');
		}
    }

    function handleChangeRegister(e){
        const name = e.target.name;
        const value = e.target.value;
		switch(name){
			case 'email':
				setRegisterForm({ email: value, password: registerForm.password });
				break;
			case 'password':
				setRegisterForm({ email: registerForm.email, password: value });
				break;
			default:
				console.log('erreur !');
		}
    }

    function handleSubmitLogin(e){
        e.preventDefault();
        // envoi les données au server nodejs
		axios({
			method: "POST", 
			url:"http://localhost:8000/login", 
			data: loginForm
		}).then((response)=>{					
			if (response.data === 'done'){
                alert('Félicitation, vous êtes authentifié.');
                setLoginForm({email: '', password: ''});
            } 
            else
                alert(response.data);
        });
    }

    function handleSubmitRegister(e){
		e.preventDefault();
        // envoi les données au server nodejs
		axios({
			method: "POST", 
			url:"http://localhost:8000/register", 
			data: registerForm
		}).then((response)=>{					
			if (response.data === 'done'){
                alert('Votre compte a été créé avec succès !');
                setRegisterForm({email: '', password: ''});
            } 
            else
                alert(response.data);
        });
    }

    return(
        <div className="form-box">
			<div className="button-box">
				<div ref={button} id="btn"></div>
				<button type="button" className="toggle-btn" onClick={loginButton}>Login</button>
				<button type="button" className="toggle-btn" onClick={registerButton}>Register</button>
			</div>
			<form ref={log} className="input-group" id="login" onSubmit={handleSubmitLogin}>
				<div className="input-field">
					<input type="email" name="email" required autocomplete="off" value={loginForm.email} onChange={handleChange} />
					<span></span>
					<label>Email</label>
				</div>
				<div className="input-field">
					<input type="password" name="password" required value={loginForm.password} onChange={handleChange} />
					<span></span>
					<label>Mot de passe</label>
				</div>
				<div className="pass"> 
					<a href="#">Mot de passe oublié ?</a>
				</div>
				<input type="submit" name="login" value="login" />
				<div className="signup_link">
					Pas encore membre ? <a onClick={registerButton} href="#">s'inscrire</a>
				</div>
			</form>
			
			<form ref={reg} className="input-group" id="register" onSubmit={handleSubmitRegister}>
				<div className="input-field">
					<input type="email" name="email" required value={registerForm.email} onChange={handleChangeRegister} />
					<span></span>
					<label>Email</label>
				</div>
				<div className="input-field">
					<input type="password" name="password" required value={registerForm.password} onChange={handleChangeRegister} />
					<span></span>
					<label>Mot de passe</label>
				</div>
				<div className="pass">
					<input type="checkbox" /> J'accepte les termes et conditions
				</div>
				<input type="submit" name="register" value="register" />
			</form>
		</div>
    )
}

export default Authentication;