template Square() {
    signal input in;
    signal output out;

    out <== in * in;
}

template Add() {
    signal input in;
    signal output out;

    out <== in + 6;
}

template Calculator() {
    signal private input secret;
    signal output out;

    component square = Square();
    component add = Add();
  
    square.in <== secret;
    add.in <== square.out;

    out <== add.out;
}

component main = Calculator();