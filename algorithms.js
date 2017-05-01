// First case - RANDOM SEARCH
class Random_Search {
  constructor() {
    this.order = [];
    this.best_order = [];
    this.best_distance = Infinity;
    this.best_when_found = 0;

    for (let i = 0; i < points.length; i++) {
      this.order.push(i);
    }
    this.best_order = this.order.slice();
  }

  calculate_distance() {
    let dist = 0;
    for (let i = 0; i < points.length - 1; i++) {
      dist += points[this.order[i]].dist(points[this.order[i+1]]);
    }

    if (dist < this.best_distance) {
      this.best_order = this.order.slice();
      this.best_distance = dist;
      this.best_when_found = frameCount;
    }
    return dist;
  }

  get_actual_order() {
    return this.order;
  }

  get_best_order() {
    return this.best_order;
  }

  shuffle_order() {
    this.order = shuffle(this.order);
  }

}

// Second case - BRUTE FORCE SEARCH
class Brute_Force {
  constructor() {
    this.finished = false;
    this.order = [];
    this.best_order = [];
    this.best_distance = Infinity;
    this.best_when_found = 0;
    this.counter = 0;

    for (let i = 0; i < points.length; i++) {
      this.order.push(i);
    }
    this.best_order = this.order.slice();
  }

  calculate_distance() {
    if (this.finished) {
      return Infinity;
    } else {
      let dist = 0;
      for (let i = 0; i < points.length - 1; i++) {
        dist += points[this.order[i]].dist(points[this.order[i+1]]);
      }

      if (dist < this.best_distance) {
        this.best_order = this.order.slice();
        this.best_distance = dist;
        this.best_when_found = frameCount;
      }
      return dist;
    }
  }

  get_actual_order() {
    return this.order;
  }

  get_best_order() {
    return this.best_order;
  }

  swap_indexes(arr, indexA, indexB) {
    let temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
  }

  next_order() {
    if (this.finished) {
      return -1;
    }
    this.counter++;

    let largestI = -1;
    let largestJ = -1;

    // Find the largest i such that P(i) < P(i+1)
    for (let i = 0; i < this.order.length - 1; i++) {
      if (this.order[i] < this.order[i+1]) {
        largestI = i;
      }
    }

    if (largestI === -1) {
      this.finished = true;
    } else {

      // Find the largest j such that P(i) < P(j)
      for (let j = 0; j < this.order.length; j++) {
        if (this.order[largestI] < this.order[j]) {
          largestJ = j;
        }
      }

      // Swap P(i) and p(j)
      this.swap_indexes(this.order, largestI, largestJ);
      //console.log(this.order);

      // Reverse the end of the array since P(i+1)
      let endArray = this.order.splice(largestI + 1);
      endArray.reverse();
      this.order = this.order.concat(endArray);
    }
  }
}

class Genetic_Algorithm {
  constructor(dna_order) {
    this.fitness = 1;
    this.order = dna_order;
  }

  calculate_distance() {
    let dist = 0;
    for (let i = 0; i < points.length - 1; i++) {
      dist += points[this.order[i]].dist(points[this.order[i+1]]);
    }
    return dist;
  }

  get_order() {
    return this.order;
  }

  get_mutated_order() {
    let i = floor(random(this.order.length));
    let j = floor(random(this.order.length));
    let new_order = this.order.slice();
    let temp_value = new_order[i];
    new_order[i] = new_order[j];
    new_order[j] = temp_value;

    for (let k = 0; k < 4; k++) {
      i = floor(random(this.order.length));
      j = floor(random(this.order.length));
      temp_value = new_order[i];
      new_order[i] = new_order[j];
      new_order[j] = temp_value;
    }
    return new_order;
  }
}
