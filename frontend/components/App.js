import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import axiosWithAuth  from "../axios/index";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
	// ✨ MVP can be achieved with these states
	const [message, setMessage] = useState("");
	const [articles, setArticles] = useState([]);
	const [currentArticleId, setCurrentArticleId] = useState();
	const [spinnerOn, setSpinnerOn] = useState(false);

	// ✨ Research `useNavigate` in React Router v.6
	const navigate = useNavigate();
	const redirectToLogin = () => {
		navigate("/");
	};
	const redirectToArticles = () => {
		navigate("/articles");
	};

	const logout = () => {
		localStorage.removeItem("token");
		redirectToLogin();
		setMessage("Goodbye!");
	};

	const login = ({ username, password }) => {
		setSpinnerOn(true);
		axios.post(loginUrl, { username, password }).then((res) => {
			localStorage.setItem("token", res.data.token);
			redirectToArticles();
			setMessage(`Here are your articles, ${username}!`);
			setSpinnerOn(false);
		});
	};

	const getArticles = () => {
		setSpinnerOn(true);
		setMessage("");
		axiosWithAuth()
			.get(articlesUrl)
			.then((res) => {
				setArticles(res.data.articles);
				setMessage(res.data.message);
				setSpinnerOn(false);
			})
			.catch((err) => {
				if (err.response.status === 401) {
					redirectToLogin();
				}
			});
	};

	const postArticle = (article) => {
		setSpinnerOn(true);
		setMessage("");
		axiosWithAuth()
			.post(articlesUrl, article)
			.then((res) => {
				setMessage(res.data.message);
				setSpinnerOn(false);
				setArticles([...articles, res.data.article]);
			})
			.catch((err) => {
				if (err.response.status === 401) {
					redirectToLogin();
				}
			});
	};

	const updateArticle = ({ article_id, article }) => {
		setSpinnerOn(true);
    setMessage("");
    console.log(article_id, article);
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((res) => {
        setArticles(
          articles.map((art) =>
            art.article_id === article_id ? res.data.article : art
          )
        );
        setSpinnerOn(false);
        setMessage(res.data.message);
        setCurrentArticleId(null);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          redirectToLogin();
        }
      });
	};

	const deleteArticle = (article_id) => {
		setSpinnerOn(true);
    setMessage("");
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`).then((res) => {
      setArticles(articles.filter((art) => art.article_id !== article_id));
      setSpinnerOn(false);
      setMessage(res.data.message);
    });
	};

	return (
		// ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
		<>
			<Spinner on={spinnerOn} />
			<Message message={message} />
			<button id="logout" onClick={logout}>
				Logout from app
			</button>
			<div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
				{" "}
				{/* <-- do not change this line */}
				<h1>Advanced Web Applications</h1>
				<nav>
					<NavLink id="loginScreen" to="/">
						Login
					</NavLink>
					<NavLink id="articlesScreen" to="/articles">
						Articles
					</NavLink>
				</nav>
				<Routes>
					<Route path="/" element={<LoginForm login={login} />} />
					<Route
						path="articles"
						element={
							<>
								<ArticleForm
									currentArticle={
										currentArticleId
											? articles.find(
													(art) => art.article_id === currentArticleId
											  )
											: null
									}
                  setCurrentArticleId={setCurrentArticleId}
									postArticle={postArticle}
                  updateArticle={updateArticle}
								/>
								<Articles
									setCurrentArticleId={setCurrentArticleId}
									currentArticleId={currentArticleId}
									articles={articles}
									getArticles={getArticles}
                  deleteArticle={deleteArticle}
								/>
							</>
						}
					/>
				</Routes>
				<footer>Bloom Institute of Technology 2022</footer>
			</div>
		</>
	);
}