// Crazy global variables
var num_of_nodes = 12;
var points = [];
var random_search;
var brute_search;
var combinations;
var population_size = 30;
var population = [];
var best_distance_in_GA = Infinity;
var best_order_in_GA = [];
var best_ever_found_frame = 0;

// Setup for p5.js
function setup() {
  // Get the number of cities
  let new_number = Number(getURLParams()['cities']);
  if (new_number > 0) {
	num_of_nodes = new_number;
  }
  
  combinations = factorial(num_of_nodes);
  
  my_canvas = createCanvas(900, 400);
  my_canvas.parent('main_canvas');

  // create all the nodes as a vector
  for (let i = 0; i < num_of_nodes; i++) {
    let x = random(300);
    let y = random(200);
    points.push(createVector(x, y));
  }

  // Initialize the random search algorithm
  random_search = new Random_Search();

  // Initialize the brute forcce algorithm
  brute_search = new Brute_Force();

  // Create Population
  for (let i = 0; i < population_size; i++) {
    let temp_order = [];
    for (let j = 0; j < num_of_nodes; j++) {
      temp_order.push(j);
    }
    temp_order = shuffle(temp_order);
    population.push(new Genetic_Algorithm(temp_order));
  }

  document.getElementById('ga_info').innerHTML += ' Population size is ' + population_size + '.'
}

// Draw for p5.js
function draw() {
  background(51);
  stroke(0);
  fill(255);
  
  // Draw the separating lines
  stroke(255);
  line(300, 0, 300, height);
  line(600, 0, 600, height);

  // Draw the points
  push();
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < points.length; j++) {
      ellipse(points[j].x, points[j].y, 9);
    }
    translate(300, 0);
  }
  pop();

  // Draw the text
  textSize(25);
  strokeWeight(1);
  text("Random search", 60, 230);
  text("Brute force", 390, 230);
  text("Genetic algorithm", 650, 230);

  // First case
  // Random search algorithm
  let order = random_search.get_actual_order();

  // Draw the lines of the random search algorithm
  stroke(255);
  strokeWeight(1);

  for (let i = 0; i < points.length - 1; i++) {
    line(points[order[i]].x, points[order[i]].y, points[order[i + 1]].x, points[order[i + 1]].y);
  }

  // Draw the lines of the best found by random search
  order = random_search.get_best_order();
  stroke(255, 0, 0);
  strokeWeight(2);

  for (let i = 0; i < points.length - 1; i++) {
    line(points[order[i]].x, points[order[i]].y, points[order[i + 1]].x, points[order[i + 1]].y);
  }

  random_search.calculate_distance();
  random_search.shuffle_order();

  // Second case
  // Brute Force
  order = brute_search.get_actual_order();

  // Translate canvas origin
  push();
  translate(300, 0);

  // Draw the lines of the brute force search algorithm
  stroke(255);
  strokeWeight(1);

  for (let i = 0; i < points.length - 1; i++) {
    line(points[order[i]].x, points[order[i]].y, points[order[i + 1]].x, points[order[i + 1]].y);
  }

  brute_search.calculate_distance();

  // Draw the lines of the best found by random search
  order = brute_search.get_best_order();
  stroke(255, 0, 0);
  strokeWeight(2);

  for (let i = 0; i < points.length - 1; i++) {
    line(points[order[i]].x, points[order[i]].y, points[order[i + 1]].x, points[order[i + 1]].y);
  }

  pop();

  order = brute_search.next_order();

  // Thir part
  // Genetic algorithm
  // Calculate fitness and calculate each distance to find the best in current generation
  let total_distance = 0;
  let best_distance_in_pop = Infinity;
  let best_order_in_pop = [];
  let my_fitness = [];

  for (let i = 0; i < population.length; i++) {
    let this_dist = population[i].calculate_distance();
    my_fitness.push(this_dist);
    total_distance += this_dist;

    if (this_dist < best_distance_in_pop) {
      best_distance_in_pop = this_dist;
      best_order_in_pop = population[i].get_order();
    }

  }
  // Draws best distance in this generation
  push();
  translate(600, 0);
  stroke(255);
  strokeWeight(1);

  for (let i = 0; i < points.length - 1; i++) {
    //line(points[best_order_in_pop[i]].x, points[best_order_in_pop[i]].y, points[best_order_in_pop[i + 1]].x, points[best_order_in_pop[i + 1]].y);
  }

  // Checks for the best ever
  if (best_distance_in_pop < best_distance_in_GA) {
    best_distance_in_GA = best_distance_in_pop;
    best_order_in_GA = best_order_in_pop;
    best_ever_found_frame = frameCount;
  }

  // Draws the best ever in GA
  stroke(255, 0, 0);
  for (let i = 0; i < points.length - 1; i++) {
    line(points[best_order_in_GA[i]].x, points[best_order_in_GA[i]].y, points[best_order_in_GA[i + 1]].x, points[best_order_in_GA[i + 1]].y);
  }

  pop();

  // Calculate normalized fitness score
  for (let i = 0; i < population.length; i++) {
    population[i].fitness = my_fitness[i] / total_distance;
  }
  //console.log(population);
  //noLoop();
  // Pick new population and mutate
  let new_population = [];
  new_population.push(new Genetic_Algorithm(best_order_in_pop)); // Keep the best one
  let temp_one = new Genetic_Algorithm(best_order_in_pop);
  new_population.push(new Genetic_Algorithm(temp_one.get_mutated_order()));

  for (let i = 0; i < population.length - 2; i++) {
    let not_found = true;
    let index = 0;
    let chance = random();

    while(not_found) {
      if (population[index % population.length].fitness < chance) {
        // match
        new_population.push(new Genetic_Algorithm(population[i].get_mutated_order()));
        not_found = false;
      }
      index++;
      chance = random();
    }
  }

  // Set next generation
  population = new_population.slice();

  // Text info
  textSize(20);
  text('Distance: ' + nf(random_search.best_distance, 0, 3) + ' px', 10, 300);
  text('When found: ' + random_search.best_when_found + 'th iteration', 10, 330);
  text(nf(frameCount, 0, 0) + ' tries', 10, 360);

  text('Distance: ' + nf(brute_search.best_distance, 0, 3) + ' px', 310, 300);
  text(brute_search.best_when_found + 'th iteration', 310, 330);
  text(nf(brute_search.counter / combinations * 100, 0, 3) + '% searched', 310, 360);

  text('Best ever: ' + nf(best_distance_in_GA, 0, 3) + ' px', 620, 300);
  text(best_ever_found_frame + 'th iteration', 620, 330);
  text('Avg this gen: ' + nf(total_distance/population.length, 0, 3) + ' px', 620, 360);

  fill(0);
  textSize(10);
  stroke(255);
  strokeWeight(3);
  text('Framerate: ' + round(frameRate(), 0), width-70, 10);
}

function factorial(n) {
  if (n === 1 || n === 0) {
    return 1;
  } else {
    return n * factorial(n-1);
  }
}

function change_cities() {
  let new_number = document.getElementById('new_number_of_cities').value;
  window.location.href = getURL().split('?')[0] + '?cities=' + new_number;
}