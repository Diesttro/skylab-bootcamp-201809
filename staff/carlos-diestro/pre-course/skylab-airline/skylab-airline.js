var flights = [
  {id: 00, to: "New York", from: "Barcelona", cost: 700,scale: false},
  {id: 01, to: "Los Angeles", from: "Madrid", cost: 1100,scale: true},
  {id: 02, to: "Paris", from: "Barcelona", cost: 210,scale: false},
  {id: 03, to: "Roma", from: "Barcelona", cost: 150,scale: false},
  {id: 04, to: "London", from: "Madrid", cost: 200,scale: false},
  {id: 05, to: "Madrid", from: "Barcelona", cost: 90,scale: false},
  {id: 06, to: "Tokyo", from: "Madrid", cost: 1500,scale: true},
  {id: 07, to: "Shangai", from: "Barcelona", cost: 800,scale: true},
  {id: 08, to: "Sydney", from: "Barcelona", cost: 150,scale: true},
  {id: 09, to: "Tel-Aviv", from: "Madrid", cost: 150,scale: false}
];

airline();

function airline() {
  var name = prompt("Cual es tu nombre");
  var cost = 0;
  var scale = 0;

  console.log("Hola " + name);

  for(flight in flights) {
    cost += flights[flight].cost;
    
    if(flights[flight].scale) {
      scale++;
    }

    if(flight == (flights.length - 5)) {
      console.log("Últimos vuelos!");
    }

    console.log("El vuelo con origen " + flights[flight].from + " y destino " + flights[flight].to + " tiene un coste de " + flights[flight].cost + "€" + (flights[flight].scale ? " y realiza escala" : " y no realiza escala"));
  }

  cost /= flights.length;

  console.log("El precio medio de los vuelos es " + cost + "€");
  console.log(scale + " vuelos hacen escala");
}