import init, { init_panic_hook } from "./lib/index.js";
import runApp from "./main.js";

async function run() {
  await init();
  init_panic_hook();

  runApp();

  // const config = Config.new({ level: 4, starting_count: [[1, 0], [2, 0]], budget: 45 });
  // const metric1 = new EvaluationMetric({ kind: 'quantity', stars: 2 });
  // const metric2 = new EvaluationMetric({ kind: 'any', count: 1, stars: 2 });

  // const evaluator = new Evaluator(config);
  // for (let i = 0; i < 6; ++i) {
  //     evaluator.run(250);
  //     console.log('steps', evaluator.size());
  //     console.log('metric1', evaluator.evaluate(metric1));
  //     console.log('metric2', evaluator.evaluate(metric2));
  // }
  // console.log('e', evaluator.evaluate(metric1)[0]);
}
run();
