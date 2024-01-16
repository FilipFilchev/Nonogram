import { useState, useEffect } from "react";
import './rendered_grid.css'

let generateGrid = [];


const Handler = (props) => {
	// usestate for setting a javascript
	// object for storing and using data
	const [data, setData] = useState({
		grid: "",
		rows: "",
		cols: ""
	});




	


	// Using useEffect for single rendering
	useEffect((someText) => {
		// Using fetch to fetch the api from
		// flask server it will be redirected to proxy
		fetch("http://localhost:5000/data")
		.then((res) => res.json())
		.then((data) => {
				// Setting a data from api

				console.log(data.Grid)
				setData({
					grid: data.Grid,
					rows: data.Row_hints,
					cols: data.Col_hints
					
				});
			}
		);
	}, []);

	//Fill grid value with requested data
	generateGrid=data.grid;




	console.table(data.grid)
	return (
		
		<div >
			<header>
				<p>React and flask</p>
				
				{/* Calling a data from setdata for showing */}
				<p>{data.grid}</p>
				<p>{data.rows}</p>
				<p>{data.cols}</p>
				<p>{generateGrid}</p>
				<div>

					
				</div>

			</header>
		</div>
	);
}

export default Handler;



// const Handler = () => {
// 	// usestate for setting a javascript
// 	// object for storing and using data
// 	const [data, setData] = useState({
// 		name: "",
// 		age: 100,
// 		date: "",
// 		programming: "",
// 	});


// 	// Using useEffect for single rendering
// 	useEffect(() => {
// 		// Using fetch to fetch the api from
// 		// flask server it will be redirected to proxy
// 		fetch("http://localhost:5000/data")
// 		.then((res) => res.json())
// 		.then((data) => {
// 				// Setting a data from api

// 				console.log(data.name)
// 				setData({
// 					name: data.Name,
// 					age: data.Age,
// 					date: data.Date,
// 					programming: data.programming,
// 				});
// 			}
// 		);
// 	}, []);

// 	return (
// 		<div >
// 			<header>
// 				<h1>React and flask</h1>
				
// 				{/* Calling a data from setdata for showing */}
// 				<p>{data.name}</p>
// 				<p>{data.age}</p>
// 				<p>{data.date}</p>
// 				<p>{data.programming}</p>

// 			</header>
// 		</div>
// 	);
// }

// export default Handler;