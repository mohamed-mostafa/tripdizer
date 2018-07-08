/**
 * The dataaccess methods of hws
 */

var daoUtilities = require("./hws_dao_utilities.js");

var getById = function (id, lang, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			var iternaryQuery = `SELECT * FROM iternary WHERE id = ${connection.escape(id)};`;
			var countriesQuery = `SELECT ic.Countries_Id as id, ic.Order as \'order\', ic.Days as days FROM iternary i join iternary_countries ic on i.Id = ic.Iternary_Id WHERE i.Id = ${connection.escape(id)};`;
			var ferryQuery = `SELECT ife.*, mp.* FROM iternary i join iternary_ferry ife on i.Id = ife.iternary_id join month_price mp on mp.id = ife.price WHERE i.Id = ${connection.escape(id)};`;
			var flightQuery = `SELECT ifl.*, mpa.JAN aJAN, mpa.FEB aFEB, mpa.MAR aMAR, mpa.APR aAPR, mpa.MAY aMAY, mpa.JUN aJUN, mpa.JUL aJUL, mpa.AUG aAUG, mpa.SEP aSEP, mpa.OCT aOCT, mpa.NOV aNOV, mpa.DEC aDEC, 
			mpk.JAN kJAN, mpk.FEB kFEB, mpk.MAR kMAR, mpk.APR kAPR, mpk.MAY kMAY, mpk.JUN kJUN, mpk.JUL kJUL, mpk.AUG kAUG, mpk.SEP kSEP, mpk.OCT kOCT, mpk.NOV kNOV, mpk.DEC kDEC,
			mpi.JAN iJAN, mpi.FEB iFEB, mpi.MAR iMAR, mpi.APR iAPR, mpi.MAY iMAY, mpi.JUN iJUN, mpi.JUL iJUL, mpi.AUG iAUG, mpi.SEP iSEP, mpi.OCT iOCT, mpi.NOV iNOV, mpi.DEC iDEC
			FROM iternary i join iternary_flight ifl on i.Id = ifl.Iternary_id join month_price mpa on mpa.id = ifl.adult_price join month_price mpk on mpk.id = ifl.kid_price join month_price mpi on mpi.id = ifl.infant_price WHERE i.Id = ${connection.escape(id)};`;
			var hotelQuery = `SELECT ih.*, c.EN_Name AS Country_Name, mp.* FROM iternary i join iternary_hotel ih on i.Id = ih.Iternary_id join month_price mp on mp.id = ih.night_price LEFT JOIN Countries c on c.Id = ih.Country_Id WHERE i.Id =  ${connection.escape(id)};`;
			var seasonQuery = `SELECT Start AS start, End AS end, Type AS type FROM iternary i join iternary_season s on i.Id = s.Iternary_Id WHERE i.Id = ${connection.escape(id)};`;
			var budgetQuery = `SELECT bg.* FROM iternary i join iternary_budget_category bg on i.Id = bg.iternary_Id WHERE i.Id = ${connection.escape(id)};`;
			var purposeQuery = `SELECT tb.* FROM iternary i join iternary_travel_purpose tb on i.Id = tb.iternary_Id WHERE i.Id = ${connection.escape(id)};`;
			var interestQuery = `SELECT ii.* FROM iternary i join iternary_interest ii on i.Id = ii.iternary_Id WHERE i.Id = ${connection.escape(id)};`;
			connection.query(iternaryQuery + countriesQuery + ferryQuery + flightQuery + hotelQuery + seasonQuery + budgetQuery + purposeQuery + interestQuery, [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a itinerary with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows[0].length != 0) {
						// populate the itinerary attributes
						var itinerary = {
							id: rows[0][0].Id,
							en_name: rows[0][0].EN_Name,
							en_description: rows[0][0].EN_Description,
							ar_name: rows[0][0].AR_Name,
							ar_description: rows[0][0].AR_Description,
							dailySpendings: rows[0][0].Daily_Spendings,
							needsVisa: rows[0][0].Needs_Visa,
							introduction: rows[0][0].Introduction,
							includes: rows[0][0].Includes,
							excludes: rows[0][0].Excludes,
							image1: rows[0][0].Image1,
							image2: rows[0][0].Image2,
							countries: rows[1],
							ferries: rows[2],
							flights: rows[3],
							hotels: rows[4],
							seasons: rows[5],
							budgetCategories: rows[6],
							purposes: rows[7],
							interests: rows[8]
						};
						if (lang) {
							itinerary.name = itinerary[lang.toLowerCase() + '_name'];
							itinerary.description = itinerary[lang.toLowerCase() + '_description'];
						}

						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(itinerary);
					} else {
						// no itinerary is found with the id
						connection.end();
						onSuccess(null);
					}
				}

			});
		}
	});
};


var create = function (itinerary, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the itinerary and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO iternary (EN_Name, EN_Description, AR_Name, AR_Description, Daily_Spendings, Needs_Visa, Introduction, Includes, Excludes, Image1, Image2) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [itinerary.en_name, itinerary.en_description, itinerary.ar_name, itinerary.ar_description, itinerary.dailySpendings, itinerary.needsVisa, itinerary.introduction, itinerary.includes, itinerary.excludes, itinerary.image1, itinerary.image2], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to create the new itinerary: " + itinerary.en_name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// set the itineraryId to the itinerary
							itinerary.id = result.insertId;

							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(itinerary);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a itinerary object if successful
//calls the onFailure with an err object in case of technical error
var update = function (itinerary, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the itinerary and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					var updateQuery = `UPDATE iternary SET EN_Name = ${connection.escape(itinerary.en_name || "")}, EN_Description = ${connection.escape(itinerary.en_description || "")}, AR_Name = ${connection.escape(itinerary.ar_name || "")}, AR_Description = ${connection.escape(itinerary.ar_description || "")}, Daily_Spendings = ${connection.escape(itinerary.dailySpendings || 0)}, Needs_Visa = ${connection.escape(itinerary.needsVisa || 0)}, Introduction = ${connection.escape(itinerary.introduction || "")}, Includes = ${connection.escape(itinerary.includes || "")}, Excludes = ${connection.escape(itinerary.excludes || "")}, Image1 = ${connection.escape(itinerary.image1)}, Image2 = ${connection.escape(itinerary.image2)} WHERE Id = ${connection.escape(itinerary.id)};`;
					var countriesQuery = `DELETE FROM iternary_countries WHERE Iternary_Id = ${connection.escape(itinerary.id)};`;
					for (let i = 0; i < itinerary.countries.length; i++) {
						if (i === 0) countriesQuery += `INSERT INTO iternary_countries VALUES `;
						else countriesQuery += ', ';
						countriesQuery += `(${connection.escape(itinerary.id)}, ${connection.escape(itinerary.countries[i].id)}, ${connection.escape(itinerary.countries[i].order || 0)}, ${connection.escape(itinerary.countries[i].days || 0)})`;
						if (i === itinerary.countries.length - 1) countriesQuery += ';';
					}
					var ferriesQuery = `DELETE FROM month_price WHERE id in (SELECT price FROM iternary_ferry WHERE Iternary_Id = ${connection.escape(itinerary.id)});DELETE FROM iternary_ferry WHERE Iternary_Id = ${connection.escape(itinerary.id)};`;
					for (let i = 0; i < itinerary.ferries.length; i++) {
						if (itinerary.ferries[i].departing_from && itinerary.ferries[i].arriving_to) {
							ferriesQuery += `INSERT INTO month_price VALUES (0, ${connection.escape(itinerary.ferries[i].JAN || 0)}, ${connection.escape(itinerary.ferries[i].FEB || 0)}, ${connection.escape(itinerary.ferries[i].MAR || 0)}, ${connection.escape(itinerary.ferries[i].APR || 0)}, ${connection.escape(itinerary.ferries[i].MAY || 0)}, ${connection.escape(itinerary.ferries[i].JUN || 0)}, ${connection.escape(itinerary.ferries[i].JUL || 0)}, ${connection.escape(itinerary.ferries[i].AUG || 0)}, ${connection.escape(itinerary.ferries[i].SEP || 0)}, ${connection.escape(itinerary.ferries[i].OCT || 0)}, ${connection.escape(itinerary.ferries[i].NOV || 0)}, ${connection.escape(itinerary.ferries[i].DEC || 0)});`;
							ferriesQuery += 'INSERT INTO iternary_ferry (`iternary_id`, `price`, `departing_from`, `arriving_to`, `carrier_name`) VALUES ';
							ferriesQuery += `(${connection.escape(itinerary.id)}, LAST_INSERT_ID(), ${connection.escape(itinerary.ferries[i].departing_from || "")}, ${connection.escape(itinerary.ferries[i].arriving_to || "")}, ${connection.escape(itinerary.ferries[i].carrier_name || "")});`;
						}
					}
					var flightsQuery = `DELETE FROM month_price WHERE id in (SELECT adult_price FROM iternary_flight WHERE Iternary_Id = ${connection.escape(itinerary.id)}) OR id in (SELECT kid_price FROM iternary_flight WHERE Iternary_Id = ${connection.escape(itinerary.id)}) OR id in (SELECT infant_price FROM iternary_flight WHERE Iternary_Id = ${connection.escape(itinerary.id)});DELETE FROM iternary_flight WHERE Iternary_Id = ${connection.escape(itinerary.id)};`;
					for (let i = 0; i < itinerary.flights.length; i++) {
						if (itinerary.flights[i].departing_from && itinerary.flights[i].arriving_to) {
							flightsQuery += `INSERT INTO month_price VALUES (0, ${connection.escape(itinerary.flights[i].aJAN || 0)}, ${connection.escape(itinerary.flights[i].aFEB || 0)}, ${connection.escape(itinerary.flights[i].aMAR || 0)}, ${connection.escape(itinerary.flights[i].aAPR || 0)}, ${connection.escape(itinerary.flights[i].aMAY || 0)}, ${connection.escape(itinerary.flights[i].aJUN || 0)}, ${connection.escape(itinerary.flights[i].aJUL || 0)}, ${connection.escape(itinerary.flights[i].aAUG || 0)}, ${connection.escape(itinerary.flights[i].aSEP || 0)}, ${connection.escape(itinerary.flights[i].aOCT || 0)}, ${connection.escape(itinerary.flights[i].aNOV || 0)}, ${connection.escape(itinerary.flights[i].aDEC || 0)})`;
							flightsQuery += `, (0, ${connection.escape(itinerary.flights[i].kJAN || 0)}, ${connection.escape(itinerary.flights[i].kFEB || 0)}, ${connection.escape(itinerary.flights[i].kMAR || 0)}, ${connection.escape(itinerary.flights[i].kAPR || 0)}, ${connection.escape(itinerary.flights[i].kMAY || 0)}, ${connection.escape(itinerary.flights[i].kJUN || 0)}, ${connection.escape(itinerary.flights[i].kJUL || 0)}, ${connection.escape(itinerary.flights[i].kAUG || 0)}, ${connection.escape(itinerary.flights[i].kSEP || 0)}, ${connection.escape(itinerary.flights[i].kOCT || 0)}, ${connection.escape(itinerary.flights[i].kNOV || 0)}, ${connection.escape(itinerary.flights[i].kDEC || 0)})`;
							flightsQuery += `, (0, ${connection.escape(itinerary.flights[i].iJAN || 0)}, ${connection.escape(itinerary.flights[i].iFEB || 0)}, ${connection.escape(itinerary.flights[i].iMAR || 0)}, ${connection.escape(itinerary.flights[i].iAPR || 0)}, ${connection.escape(itinerary.flights[i].iMAY || 0)}, ${connection.escape(itinerary.flights[i].iJUN || 0)}, ${connection.escape(itinerary.flights[i].iJUL || 0)}, ${connection.escape(itinerary.flights[i].iAUG || 0)}, ${connection.escape(itinerary.flights[i].iSEP || 0)}, ${connection.escape(itinerary.flights[i].iOCT || 0)}, ${connection.escape(itinerary.flights[i].iNOV || 0)}, ${connection.escape(itinerary.flights[i].iDEC || 0)});`;
							flightsQuery += 'INSERT INTO iternary_flight (`iternary_id`, `type`, `departing_from`, `arriving_to`, `departure_time`, `arrival_time`, `lay_over`, `airline_name`, `return`, `return_departure_time`, `return_arrival_time`, `return_lay_over`, `adult_price`, `kid_price`, `infant_price`) VALUES ';
							flightsQuery += `(${connection.escape(itinerary.id)}, ${connection.escape(itinerary.flights[i].type || 0)}, ${connection.escape(itinerary.flights[i].departing_from || "")}, ${connection.escape(itinerary.flights[i].arriving_to || "")}, ${connection.escape(itinerary.flights[i].departure_time || "")}, ${connection.escape(itinerary.flights[i].arrival_time || "")}, ${connection.escape(itinerary.flights[i].lay_over || "")}, ${connection.escape(itinerary.flights[i].airline_name || "")}, ${connection.escape(itinerary.flights[i].return || itinerary.flights[i].return == 1 ? 1 : 0)}, ${connection.escape(itinerary.flights[i].return_departure_time || "")}, ${connection.escape(itinerary.flights[i].return_arrival_time || "")}, ${connection.escape(itinerary.flights[i].return_lay_over || "")}, (SELECT id FROM month_price ORDER BY id DESC LIMIT 2, 1), (SELECT id FROM month_price ORDER BY id DESC LIMIT 1, 1), (SELECT id FROM month_price ORDER BY id DESC LIMIT 0, 1));`;
						}
					}
					var hotelsQuery = `DELETE FROM month_price WHERE id in (SELECT night_price FROM iternary_hotel WHERE Iternary_Id = ${connection.escape(itinerary.id)});DELETE FROM iternary_hotel WHERE Iternary_Id = ${connection.escape(itinerary.id)};`;
					for (let i = 0; i < itinerary.hotels.length; i++) {
						if (itinerary.hotels[i].EN_Name) {
							hotelsQuery += `INSERT INTO month_price VALUES (0, ${connection.escape(itinerary.hotels[i].JAN || 0)}, ${connection.escape(itinerary.hotels[i].FEB || 0)}, ${connection.escape(itinerary.hotels[i].MAR || 0)}, ${connection.escape(itinerary.hotels[i].APR || 0)}, ${connection.escape(itinerary.hotels[i].MAY || 0)}, ${connection.escape(itinerary.hotels[i].JUN || 0)}, ${connection.escape(itinerary.hotels[i].JUL || 0)}, ${connection.escape(itinerary.hotels[i].AUG || 0)}, ${connection.escape(itinerary.hotels[i].SEP || 0)}, ${connection.escape(itinerary.hotels[i].OCT || 0)}, ${connection.escape(itinerary.hotels[i].NOV || 0)}, ${connection.escape(itinerary.hotels[i].DEC || 0)});`;
							hotelsQuery += 'INSERT INTO iternary_hotel (`Iternary_id`, `EN_Name`, `AR_Name`, `private`, `budget_category_id`, `Country_Id`, `night_price`) VALUES ';
							hotelsQuery += `(${connection.escape(itinerary.id)}, ${connection.escape(itinerary.hotels[i].EN_Name || "")}, ${connection.escape(itinerary.hotels[i].AR_Name || "")}, ${connection.escape(itinerary.hotels[i].private || 0)}, ${connection.escape(itinerary.hotels[i].budget_category_id || 1)}, ${connection.escape(itinerary.countries.length === 1 ? itinerary.countries[0].id : itinerary.hotels[i].Country_Id || 1)}, LAST_INSERT_ID());`;
						}
					}
					var seasonsQuery = `DELETE FROM iternary_season WHERE Iternary_Id = ${connection.escape(itinerary.id)};`;
					for (let i = 0; i < itinerary.seasons.length; i++) {
						if (itinerary.seasons[i].type) {
							seasonsQuery += 'INSERT INTO iternary_season (`Start`, `End`, `Type`, `Iternary_Id`) VALUES ';
							seasonsQuery += `(${connection.escape(new Date(itinerary.seasons[i].start).toLocaleDateString())}, ${connection.escape(new Date(itinerary.seasons[i].end).toLocaleDateString())}, ${connection.escape(itinerary.seasons[i].type)}, ${connection.escape(itinerary.id)});`;
						}
					}
					var budgetsQuery = `DELETE FROM iternary_budget_category WHERE iternary_Id = ${connection.escape(itinerary.id)};`;
					for (var key in itinerary.budgetCategories) {
						if (itinerary.budgetCategories.hasOwnProperty(key)) {
							budgetsQuery += 'INSERT INTO iternary_budget_category (`iternary_Id`, `budget_category_Id`, `Percentage`) VALUES ';
							budgetsQuery += `(${connection.escape(itinerary.id)}, ${connection.escape(key)}, ${connection.escape(itinerary.budgetCategories[key] || 0)});`;
						}
					}
					var purposesQuery = `DELETE FROM iternary_travel_purpose WHERE iternary_Id = ${connection.escape(itinerary.id)};`;
					for (var key in itinerary.purposes) {
						if (itinerary.purposes.hasOwnProperty(key)) {
							purposesQuery += 'INSERT INTO iternary_travel_purpose (`iternary_Id`, `travel_purpose_Id`, `Percentage`) VALUES ';
							purposesQuery += `(${connection.escape(itinerary.id)}, ${connection.escape(key)}, ${connection.escape(itinerary.purposes[key] || 0)});`;
						}
					}
					var interestsQuery = `DELETE FROM iternary_interest WHERE iternary_Id = ${connection.escape(itinerary.id)};`;
					for (var key in itinerary.interests) {
						if (itinerary.interests.hasOwnProperty(key)) {
							interestsQuery += 'INSERT INTO iternary_interest (`iternary_Id`, `interests_Id`, `Percentage`) VALUES ';
							interestsQuery += `(${connection.escape(itinerary.id)}, ${connection.escape(key)}, ${connection.escape(itinerary.interests[key] || 0)});`;
						}
					}
					connection.query(updateQuery + countriesQuery + ferriesQuery + flightsQuery + hotelsQuery + seasonsQuery + budgetsQuery + purposesQuery + interestsQuery, [], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing itinerary: " + itinerary.en_name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(itinerary);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a list of delivery persons or an empty list
//calls the onFailure with an err object in case of technical error
var getAll = function (lang, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT i.*,GROUP_CONCAT(c.Latitude separator "#") as latitude, GROUP_CONCAT(c.Longitude separator "#") as longitude, GROUP_CONCAT(c.EN_Name separator "#") as country_en_name, GROUP_CONCAT(c.AR_Name separator "#") as country_ar_name, GROUP_CONCAT(c.EN_Description separator "#") as country_en_description, GROUP_CONCAT(c.AR_Description separator "#") as country_ar_description FROM hws.iternary i left outer join hws.iternary_countries ic on i.Id = ic.Iternary_Id left outer join hws.Countries c on ic.Countries_Id = c.Id group by i.id ', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all itineraries");
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var itineraries = [];
					// populate the attributes
					for (var i = 0; i < rows.length; ++i) {
						var itinerary = {
							id: rows[i].Id,
							en_name: rows[i].EN_Name,
							en_description: rows[i].EN_Description,
							ar_name: rows[i].AR_Name,
							ar_description: rows[i].AR_Description,
							dailySpendings: rows[i].Daily_Spendings,
							needsVisa: rows[i].Needs_Visa,
							introduction: rows[i].Introduction,
							includes: rows[i].Includes,
							excludes: rows[i].Excludes,
							image1: rows[i].Image1,
							image2: rows[i].Image2,
							longitudes: rows[i].longitude,
							latitudes: rows[i].latitude,
							countries_en_descriptions: rows[i].country_en_description,
							countries_ar_descriptions: rows[i].country_ar_description,
							countries_en_names: rows[i].country_en_name,
							countries_ar_names: rows[i].country_ar_name
						};
						if (lang) {
							itinerary.name = itinerary[lang.toLowerCase() + '_name'];
							itinerary.description = itinerary[lang.toLowerCase() + '_description'];
						}
						itineraries.push(itinerary);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(itineraries);
				}
			});
		}
	});
};
//calls the onSuccess with a list of delivery persons or an empty list
//calls the onFailure with an err object in case of technical error
var getAllLong = function (onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT Id AS id FROM hws.iternary', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all itineraries");
					console.log(err);
					onFailure(err);
				} else {
					// end the connection
					connection.end();
					const itineraryFuncs = [];
					for (let i = 0; i < rows.length; i++) {
						itineraryFuncs.push(new Promise((resolve, reject) => getById(rows[i].id, 'EN', itinerary => resolve(itinerary), err => reject(err))));
					}
					// call the callback function provided by the caller, and give it the response
					Promise.all(itineraryFuncs).then(itineraries => {
						onSuccess(itineraries);
					});
				}
			});
		}
	});
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;
exports.getAllLong = getAllLong;