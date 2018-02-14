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
			var iternaryQuery = 'SELECT * FROM iternary WHERE id = ' + id + ';';
			var countriesQuery = 'SELECT ic.Countries_Id as id FROM iternary i join iternary_countries ic on i.Id = ic.Iternary_Id WHERE i.Id = ' + id + ';';
			var ferryQuery = 'SELECT ife.*, mp.* FROM iternary i join iternary_ferry ife on i.Id = ife.iternary_id join month_price mp on mp.id = ife.price WHERE i.Id = ' + id + ';';
			var flightQuery = `SELECT ifl.*, mpa.JAN aJAN, mpa.FEB aFEB, mpa.MAR aMAR, mpa.APR aAPR, mpa.MAY aMAY, mpa.JUN aJUN, mpa.JUL aJUL, mpa.AUG aAUG, mpa.SEP aSEP, mpa.OCT aOCT, mpa.NOV aNOV, mpa.DEC aDEC, 
			mpk.JAN kJAN, mpk.FEB kFEB, mpk.MAR kMAR, mpk.APR kAPR, mpk.MAY kMAY, mpk.JUN kJUN, mpk.JUL kJUL, mpk.AUG kAUG, mpk.SEP kSEP, mpk.OCT kOCT, mpk.NOV kNOV, mpk.DEC kDEC,
			mpi.JAN iJAN, mpi.FEB iFEB, mpi.MAR iMAR, mpi.APR iAPR, mpi.MAY iMAY, mpi.JUN iJUN, mpi.JUL iJUL, mpi.AUG iAUG, mpi.SEP iSEP, mpi.OCT iOCT, mpi.NOV iNOV, mpi.DEC iDEC
			FROM iternary i join iternary_flight ifl on i.Id = ifl.Iternary_id join month_price mpa on mpa.id = ifl.adult_price join month_price mpk on mpk.id = ifl.kid_price join month_price mpi on mpi.id = ifl.infant_price WHERE i.Id = ${id};`;
			var hotelQuery = 'SELECT ih.*, mp.* FROM iternary i join iternary_hotel ih on i.Id = ih.Iternary_id join month_price mp on mp.id = ih.night_price WHERE i.Id = ' + id + ';';
			var seasonQuery = 'SELECT s.* FROM iternary i join season s on i.Id = s.iternary_Id WHERE i.Id = ' + id + ';';
			connection.query(iternaryQuery + countriesQuery + ferryQuery + flightQuery + hotelQuery + seasonQuery, [], function (err, rows) {
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
							countries: rows[1].map(x => x.id.toString()),
							ferries: rows[2],
							flights: rows[3],
							hotels: rows[4],
							seasons: rows[5]
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
					connection.query('INSERT INTO iternary (EN_Name, EN_Description, AR_Name, AR_Description, Daily_Spendings) values (?, ?, ?, ?, ?)', [itinerary.en_name, itinerary.en_description, itinerary.ar_name, itinerary.ar_description, itinerary.dailySpendings], function (err, result) {
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
					var updateQuery = `UPDATE iternary SET EN_Name = '${itinerary.en_name}', EN_Description = '${itinerary.en_description}', AR_Name = '${itinerary.ar_name}', AR_Description = '${itinerary.ar_description}', Daily_Spendings = '${itinerary.dailySpendings}' WHERE Id = '${itinerary.id}';`;
					var countriesQuery = `DELETE FROM iternary_countries WHERE Iternary_Id = ${itinerary.id};`;
					for (let i = 0; i < itinerary.countries.length; i++) {
						if (i === 0) countriesQuery += `INSERT INTO iternary_countries VALUES `;
						else countriesQuery += ', ';
						countriesQuery += `(${itinerary.id}, ${itinerary.countries[i]})`;
						if (i === itinerary.countries.length - 1) countriesQuery += ';';
					}
					var ferriesQuery = `DELETE FROM month_price WHERE id in (SELECT price FROM iternary_ferry WHERE Iternary_Id = ${itinerary.id});DELETE FROM iternary_ferry WHERE Iternary_Id = ${itinerary.id};`;
					for (let i = 0; i < itinerary.ferries.length; i++) {
						ferriesQuery += `INSERT INTO month_price VALUES (0, '${itinerary.ferries[i].JAN | 0}', '${itinerary.ferries[i].FEB | 0}', '${itinerary.ferries[i].MAR | 0}', '${itinerary.ferries[i].APR | 0}', '${itinerary.ferries[i].MAY | 0}', '${itinerary.ferries[i].JUN | 0}', '${itinerary.ferries[i].JUL | 0}', '${itinerary.ferries[i].AUG | 0}', '${itinerary.ferries[i].SEP | 0}', '${itinerary.ferries[i].OCT | 0}', '${itinerary.ferries[i].NOV | 0}', '${itinerary.ferries[i].DEC | 0}');`;
						ferriesQuery += 'INSERT INTO iternary_ferry (`iternary_id`, `price`, `departing_from`, `arriving_to`, `carrier_name`) VALUES ';
						ferriesQuery += `(${itinerary.id}, LAST_INSERT_ID(), '${itinerary.ferries[i].departing_from}', '${itinerary.ferries[i].arriving_to}', '${itinerary.ferries[i].carrier_name}');`;
					}
					var flightsQuery = `DELETE FROM month_price WHERE id in (SELECT adult_price FROM iternary_flight WHERE Iternary_Id = ${itinerary.id}) OR id in (SELECT kid_price FROM iternary_flight WHERE Iternary_Id = ${itinerary.id}) OR id in (SELECT infant_price FROM iternary_flight WHERE Iternary_Id = ${itinerary.id});DELETE FROM iternary_flight WHERE Iternary_Id = ${itinerary.id};`;
					for (let i = 0; i < itinerary.flights.length; i++) {
						flightsQuery += `INSERT INTO month_price VALUES (0, '${itinerary.flights[i].aJAN | 0}', '${itinerary.flights[i].aFEB | 0}', '${itinerary.flights[i].aMAR | 0}', '${itinerary.flights[i].aAPR | 0}', '${itinerary.flights[i].aMAY | 0}', '${itinerary.flights[i].aJUN | 0}', '${itinerary.flights[i].aJUL | 0}', '${itinerary.flights[i].aAUG | 0}', '${itinerary.flights[i].aSEP | 0}', '${itinerary.flights[i].aOCT | 0}', '${itinerary.flights[i].aNOV | 0}', '${itinerary.flights[i].aDEC | 0}')`;
						flightsQuery += `, (0, '${itinerary.flights[i].kJAN | 0}', '${itinerary.flights[i].kFEB | 0}', '${itinerary.flights[i].kMAR | 0}', '${itinerary.flights[i].kAPR | 0}', '${itinerary.flights[i].kMAY | 0}', '${itinerary.flights[i].kJUN | 0}', '${itinerary.flights[i].kJUL | 0}', '${itinerary.flights[i].kAUG | 0}', '${itinerary.flights[i].kSEP | 0}', '${itinerary.flights[i].kOCT | 0}', '${itinerary.flights[i].kNOV | 0}', '${itinerary.flights[i].kDEC | 0}')`;
						flightsQuery += `, (0, '${itinerary.flights[i].iJAN | 0}', '${itinerary.flights[i].iFEB | 0}', '${itinerary.flights[i].iMAR | 0}', '${itinerary.flights[i].iAPR | 0}', '${itinerary.flights[i].iMAY | 0}', '${itinerary.flights[i].iJUN | 0}', '${itinerary.flights[i].iJUL | 0}', '${itinerary.flights[i].iAUG | 0}', '${itinerary.flights[i].iSEP | 0}', '${itinerary.flights[i].iOCT | 0}', '${itinerary.flights[i].iNOV | 0}', '${itinerary.flights[i].iDEC | 0}');`;
						flightsQuery += 'INSERT INTO iternary_flight (`iternary_id`, `type`, `departing_from`, `arriving_to`, `airline_name`, `adult_price`, `kid_price`, `infant_price`) VALUES ';
						flightsQuery += `(${itinerary.id}, ${itinerary.flights[i].type}, '${itinerary.flights[i].departing_from}', '${itinerary.flights[i].arriving_to}', '${itinerary.flights[i].airline_name}', (SELECT id FROM month_price ORDER BY id DESC LIMIT 2, 1), (SELECT id FROM month_price ORDER BY id DESC LIMIT 1, 1), (SELECT id FROM month_price ORDER BY id DESC LIMIT 0, 1));`;
					}
					var hotelsQuery = `DELETE FROM month_price WHERE id in (SELECT night_price FROM iternary_hotel WHERE Iternary_Id = ${itinerary.id});DELETE FROM iternary_hotel WHERE Iternary_Id = ${itinerary.id};`;
					for (let i = 0; i < itinerary.hotels.length; i++) {
						hotelsQuery += `INSERT INTO month_price VALUES (0, '${itinerary.hotels[i].JAN | 0}', '${itinerary.hotels[i].FEB | 0}', '${itinerary.hotels[i].MAR | 0}', '${itinerary.hotels[i].APR | 0}', '${itinerary.hotels[i].MAY | 0}', '${itinerary.hotels[i].JUN | 0}', '${itinerary.hotels[i].JUL | 0}', '${itinerary.hotels[i].AUG | 0}', '${itinerary.hotels[i].SEP | 0}', '${itinerary.hotels[i].OCT | 0}', '${itinerary.hotels[i].NOV | 0}', '${itinerary.hotels[i].DEC | 0}');`;
						hotelsQuery += 'INSERT INTO iternary_hotel (`Iternary_id`, `EN_Name`, `AR_Name`, `private`, `budget_category_id`, `night_price`) VALUES ';
						hotelsQuery += `(${itinerary.id}, '${itinerary.hotels[i].EN_Name}', '${itinerary.hotels[i].AR_Name}', '${itinerary.hotels[i].private}', '${itinerary.hotels[i].budget_category_id}', LAST_INSERT_ID());`;
					}
					var seasonsQuery = `DELETE FROM season WHERE iternary_Id = ${itinerary.id};`;
					for (let i = 0; i < itinerary.seasons.length; i++) {
						seasonsQuery += 'INSERT INTO season (`season_start`, `season_end`, `type`, `iternary_Id`) VALUES ';
						seasonsQuery += `('${itinerary.seasons[i].season_start}', '${itinerary.seasons[i].season_end}', '${itinerary.seasons[i].type}', '${itinerary.id}');`;
					}
					connection.query(updateQuery + countriesQuery + ferriesQuery + flightsQuery + hotelsQuery + seasonsQuery, [], function (err, result) {
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
			connection.query('SELECT * FROM iternary', [], function (err, rows) {
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

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;