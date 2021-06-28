import { React, useState } from "react";
import { Link } from "react-router-dom";
import "../css/RegisterUser.css";
import dog1 from "../assets/images/dog1.png";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserData } from "../actions/profile-actions.js";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "30%",
		marginTop: "30px",
		"& > * + *": {
			marginTop: theme.spacing(2),
		},
	},
}));

export default function RegisterUser() {
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [license_plate, setLicense] = useState("");
	const [phone, setPhone] = useState("");
	const [registerMessage, setRegisterMessage] = useState("");
	const history = useHistory();
	const dispatch = useDispatch();
	const classes = useStyles();

	const sendForm = (e) => {
		e.preventDefault();
		fetch("http://localhost:3001/api/users/register", {
			method: "POST",
			body: JSON.stringify({
				first_name,
				last_name,
				email,
				password,
				license_plate,
				phone,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.message) {
					setRegisterMessage(data.message);
					setEmail("");
					setPassword("");
					history.push("/registeruser");
				} else {
					getUserData(dispatch, data);
					history.push("/login");
				}
			});
		return false;
	};

	return (
		<div id="register-section">
			{registerMessage ? (
				<div id="register-toast" className={classes.root}>
					<Alert severity="error">
						Email is already in use. Please use a different email or try logging
						in if think you have an account
					</Alert>
				</div>
			) : (
				<div></div>
			)}
			<div id="user-form">
				<h1 className="login-header">Sign Up to Start Parking</h1>
				<img id="dog1-icon" src={dog1} alt="dog" />
				<form onSubmit={(e) => sendForm(e)}>
					<input
						name="first_name"
						id="top-input"
						type="text"
						placeholder="First Name"
						required
						onChange={(e) => setFirstName(e.target.value)}
					/>
					<input
						name="last_name"
						className="register-input"
						type="text"
						placeholder="Last Name"
						required
						onChange={(e) => setLastName(e.target.value)}
					/>
					<input
						name="email"
						className="register-input"
						type="email"
						placeholder="Email Address"
						required
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						name="password"
						className="register-input"
						type="password"
						placeholder="Password"
						required
						onChange={(e) => setPassword(e.target.value)}
					/>
					<input
						id="license-plate"
						name="license_plate"
						className="register-input"
						type="text"
						placeholder="License Plate Number"
						pattern="[a-zA-Z0-9!@#$%^*_|]{0,8}"
						maxLength="8"
						required
						onChange={(e) => setLicense(e.target.value)}
					/>
					<input
						name="phone"
						id="bottom-input"
						type="text"
						placeholder="Phone Number"
						pattern="[0-9!@#$%^*_|]{0,10}"
						maxLength="10"
						required
						onChange={(e) => setPhone(e.target.value)}
					/>
					<input name="access" value="driver" type="hidden" />
					<button className="register-button" id="submit-button">
						Submit Form
					</button>
					<Link className="register-link" to="/login">
						<p>Already have an account? Click here!</p>
					</Link>
				</form>
			</div>
		</div>
	);
}
