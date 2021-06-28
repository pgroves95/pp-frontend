import { React, useState} from "react";
import { Link, useHistory } from "react-router-dom";
import "../css/Login.css";
import dog from "../assets/images/dog.png";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../actions/profile-actions";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { dbReservations } from "../actions/db-reservations-actions";
import { getLoginStatus } from "../actions/login-actions";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "30%",
		marginTop: "30px",
		"& > * + *": {
			marginTop: theme.spacing(2),
		},
	},
}));

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginMessage, setLoginMessage] = useState("");
	const loginStatus = useSelector((state) => state.loginStatus)
	const profileData = useSelector((state) => state.profileData);
	const history = useHistory();
	const dispatch = useDispatch();
	const classes = useStyles();

	const sendForm = (e) => {
		e.preventDefault();
		fetch("http://localhost:3001/api/users/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.message) {
					setLoginMessage(data.message);
					setPassword("");
					history.push("/login");
				} else {
					if (loginStatus && loginStatus.length > 1) {
					getUserData(dispatch, data);
					getReservationsData();
					getLoginStatus(dispatch, "")
					history.goBack();
					} else {
					getUserData(dispatch, data);
					getReservationsData();
					getLoginStatus(dispatch, "")
					history.push("/");
				}}});
		return false;
	};

	const getReservationsData = async () => {
		const response = await fetch(`http://localhost:3001/api/reservations/${profileData.id}`, {
			method: "GET",
		});
		const parsedData = await response.json();
		dbReservations(dispatch, parsedData);
	};

	return (
		<div>
			<div id="login-section">
			{loginStatus ? (
					<div className={classes.root}>
						<Alert severity="error">
							Please login to make a reservation						</Alert>
					</div>
				) : (
					<div></div>
				)}
				{loginMessage ? (
					<div id="login-toast" className={classes.root}>
						<Alert severity="error">
							Unable to login. Please check your credentials and try again!
						</Alert>
					</div>
				) : (
					<div></div>
				)}
				<br />
				<form className="login-form" onSubmit={(e) => sendForm(e)}>
					<h1 className="login-header">Log In to Find Parking</h1>
					<img id="dog-icon" src={dog} alt="dog" />
					<input
						className="login-input-1"
						type="email"
						placeholder="Email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						required
					/>
					<input
						className="login-input-2"
						type="password"
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						required
					/>
					<button className="login-button" type="submit">
						Log In
					</button>
					<Link className="login-link" to="/RegisterUser">
						<p>Not signed up? Click here to make an account!</p>
					</Link>
				</form>
			</div>
		</div>
	);
}
