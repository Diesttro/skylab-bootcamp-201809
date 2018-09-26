var result = [];

calculator(8);
calculator(8, 1, 3);

function calculator() {
  for(var i = 0; i < arguments.length; i++) {
    if(typeof(arguments[i]) !== "number") {
      console.log("Todos los datos introducidos tienen que ser numeros");
      return;
    }
  }

  if(arguments.length == 1) {
    result.push("√" + arguments[0] + "=" + parseFloat(Math.sqrt(arguments[0]).toFixed(3)));
  } else if(arguments.length > 1) {
    sum(arguments);
    sub(arguments);
    mul(arguments);
    div(arguments);
  }

  console.log(result);
}

function sum() {
  var sum = arguments[0][0];
  var op = arguments[0][0];

  for(var i = 1; i < arguments[0].length; i++) {
    sum += arguments[0][i];
    op += "+" + arguments[0][i];
  }

  op += "=" + parseFloat(sum.toFixed(3));
  result.push(op);
}

function sub() {
  var sub = arguments[0][0];
  var op = arguments[0][0];

  for(var i = 1; i < arguments[0].length; i++) {
    sub -= arguments[0][i];
    op += "-" + arguments[0][i];
  }

  op += "=" + parseFloat(sub.toFixed(3));
  result.push(op);
}

function mul() {
  var mul = arguments[0][0];
  var op = arguments[0][0];

  for(var i = 1; i < arguments[0].length; i++) {
    mul *= arguments[0][i];
    op += "*" + arguments[0][i];
  }

  op += "=" + parseFloat(mul.toFixed(3));
  result.push(op);
}

function div() {
  var div = arguments[0][0];
  var op = arguments[0][0];
  var indef = false;

  for(var i = 1; i < arguments[0].length; i++) {
    if(arguments[0][i] == 0) {
      indef = true;
    }

    div /= arguments[0][i];
    op += "/" + arguments[0][i];
  }

  if(indef) {
    op += "=indefinido";
  } else {
    op += "=" + parseFloat(div.toFixed(3));
  }

  result.push(op);
}