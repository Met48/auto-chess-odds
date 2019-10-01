import { Config, EvaluationMetric, Evaluator } from "./lib/index.js";

const h = React.createElement;


const MAX_SIM_STEPS = 5000;
const STEP_SIZE = 50;
const MAX_BUDGET = 200;


function starsToCount(stars) {
  return Math.pow(3, stars - 1);
}


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      champions: [
        { tier: 1, count: 3 },
        { tier: 2, count: 1 },
      ],
      level: 4,
      budget: 50,
      budgetInput: 50,
    };

    this.evaluateStep = this.evaluateStep.bind(this);

    this.targets = null;
    this.buildTargets();

    this.evaluator = null;
    this.buildEvaluator();
  }

  buildTargets(state=this.state) {
    this.freeTargets();

    this.targets = [
      // TODO: Consider having 0 count units and 1 star targets.
      { kind: 'quantity', stars: 2 },
      { kind: 'quantity', stars: 3 },
    ];
    if (state.champions.length > 1) {
      for (let i = 0; i < state.champions.length; ++i) {
        this.targets.push({
          kind: 'any',
          count: i + 1,
          stars: 2,
        });
        this.targets.push({
          kind: 'any',
          count: i + 1,
          stars: 3,
        });
      }
    }
    // Initialize WASM metrics
    this.targets.forEach(target => {
      target.metric = new EvaluationMetric(target);
    });

    this.forceUpdate();
  }

  buildEvaluator(state=this.state) {
    this.freeEvaluator();
    const config = new Config({
      level: state.level,
      starting_count: state.champions.map(({ tier, count }) => [tier, count]),
      budget: state.budget,
    });
    const evaluator = new Evaluator(config);
    config.free();
    this.evaluator = evaluator;

    this.evaluateStep();
    this.forceUpdate();
  }

  evaluateStep() {
    const steps_so_far = this.evaluator.size();
    if (steps_so_far >= MAX_SIM_STEPS) {
      return;
    }
    const step_size = Math.min(STEP_SIZE, MAX_SIM_STEPS - steps_so_far);
    if (this.evaluator.run(step_size)) {
      this.forceUpdate();
      setTimeout(this.evaluateStep, 0);
    }
  }

  componentWillUnmount() {
    this.freeEvaluator();
    this.freeTargets();
  }

  freeEvaluator() {
    if (this.evaluator) {
      this.evaluator.free();
    }
  }

  freeTargets() {
    if (this.targets) {
      this.targets.forEach(target => {
        target.metric.free();
      });
    }
  }

  setState(state) {
    // if (state.budgetInput) {
    //   // TODO: Remove this hack, update after a delay instead.
    //   state = { budget: parseInt(state.budgetInput, 10), ...state };
    // }
    super.setState(state, newState => {
      if ('champions' in state) {
        this.buildTargets(newState);
      }
      if ('champions' in state || 'level' in state || 'budget' in  state) {
        this.buildEvaluator(newState);
      }
    });
  }

  render() {
    const numChampionsByStar = {
      2: 0,
      3: 0,
    };
    for (let i = 2; i <= 3; ++i) {
      const asCount = starsToCount(i);
      this.state.champions.forEach(({ count }) => {
        if (count >= asCount) {
          numChampionsByStar[i] += 1;
        }
      });
    }
    return h('div', null,
      h('div', { className: 'pre-table-row' },
        h('div', { className: 'level-wrapper' },
        h('div', { className: 'tier-select-header' }, 'Level:'),
          h('div', { className: 'level-grid' },
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => h('button', {
              key: n,
              className: `level-button ${this.state.level === n ? 'selected' : ''}`,
              onClick: () => {
                this.setState({ level: n });
              },
            }, n)),
          ),
        ),
        h('div', { className: 'budget-wrapper' },
          h('div', { className: 'tier-select-header' }, 'Budget:'),
          h('div', { className: 'budget-inner-wrapper' },
            h('input', {
              type: 'number',
              className: 'budget-input',
              min: 0,
              max: MAX_BUDGET,
              step: 10,
              value: this.state.budgetInput,
              onChange: evt => {
                // TODO: Debounce the computation?
                let value = parseInt(('0' + evt.target.value).replace(/[^0-9]/g, ''), 10);
                value = Math.max(0, Math.min(MAX_BUDGET, value));
                this.setState({ budgetInput: String(value), budget: value });  // evt.target.value });
              },
              // onKeyDown: evt => {
              //   if (evt.key === 'Enter') {
              //     let value = parseInt(('0' + evt.target.value).replace(/[^0-9]/g, ''), 10);
              //     value = Math.max(0, Math.min(100, value));
              //     this.setState({ budgetInput: String(value), budget: value });
              //   }
              // },
              // onBlur: evt => {
              //   let value = parseInt(('0' + evt.target.value).replace(/[^0-9]/g, ''), 10);
              //   value = Math.max(0, Math.min(100, value));
              //   this.setState({ budgetInput: String(value), budget: value });
              // },
            }),
            h('span', { className: 'budget-g' }, 'G'),
          ),
        ),
      ),
      h('table', null, h('tbody', null,
        h('tr', null,
          h('th'),  // For delete button
          h('th', null, 'Champion'),
          this.targets.map((target, j) => {
            if (target.kind === 'quantity') {
              return h('th', { key: j }, h(
                'div',
                null,
                h(Stars, { stars: target.stars })
              ));
            } else if (target.kind === 'any') {
              return h(
                'th',
                { key: j },
                target.count === this.state.champions.length ? 'All' : (
                  this.state.champions.length === 2 || target.count === 1 ? 'Any' : `Any ${target.count}`
                ),
                h('br'),
                h(Stars, { stars: target.stars }),
              );
            } else {
              throw new Error(`Unknown kind: ${target.kind}`);
            }
          }),
        ),
        this.state.champions.map((champ, i) => h(AppRow, {
          ...champ,
          evaluator: this.evaluator,
          targets: this.targets,
          key: i,
          index: i,
          allowDelete: this.state.champions.length !== 1,
          onChangeCount: count => {
            let champions = this.state.champions.slice();
            champions[i] = {
              ...champions[i],
              count,
            };
            this.setState({ champions });
          },
          onChangeTier: tier => {
            let champions = this.state.champions.slice();
            champions[i] = {
              ...champions[i],
              tier,
            };
            this.setState({ champions });
          },
          onDelete: () => {
            let champions = this.state.champions.slice();
            champions.splice(i, 1);
            this.setState({ champions });
          },
        })),
        h(
          'tr',
          { className: 'add-row' },
          h('td'),
          h('td', null, h('button', {
            onClick: () => {
              this.setState({
                champions: this.state.champions.concat([{ tier: 1, count: 1 }]),
              });
            },
          }, '+')),
          // Aggregate stats
          this.targets.map((target, i) => {
            let percentage = null;
            if (numChampionsByStar[target.stars] < target.count) {
              percentage = this.evaluator.evaluate(target.metric);
              if (percentage.length) {
                percentage = percentage[0] * 100;
              } else {
                percentage = null;
              }
            }
            return h(
              'td',
              { key: i },
              target.kind === 'any' ? (
                percentage === null ?
                  '-' :
                  h(Percentage, { percentage })
              ) :
              null
            );
          }),
        ),
      ))
    );
  }
}

const AppRow = ({ evaluator, targets, index, allowDelete, onDelete, tier, count, onChangeTier, onChangeCount }) => {
  return h('tr', { className: 'champion-row' },
    h('td', null, h(Delete, { disabled: !allowDelete, onClick: onDelete })),
    h('td', null,
      h('div', { className: 'champion-cell' }, h(TierSelect, { tier, onChange: onChangeTier }), h(CountSelect, { count, onChange: onChangeCount }))
    ),
    targets.map((target, i) => {
      // FIXME: This repeats the same evaluation for each row.
      let percentage = null;
      if (starsToCount(target.stars) > count) {
        percentage = evaluator.evaluate(target.metric);
        if (percentage.length > index) {
          percentage = percentage[index] * 100;
        } else {
          percentage = null;
        }
      }
      return h('td', { key: i, className: `text-center ${target.kind === 'quantity' ? '' : 'champion-cell-aggregate'}` },
        target.kind === 'quantity' ? (
          percentage === null ?
            '-' :
            h(Percentage, { percentage })
        ) : ''
      );
    }),
  )
};

const TierSelect = ({ tier, onChange }) => {
  const TIERS = [1, 2, 3, 4, 5];

  return h('span', { className: 'tier-select' },
    h('div', { className: 'tier-select-header' }, 'Tier:'),
    h('span', { className: 'tier-select-items' }, TIERS.map(itier =>
      h(
        'button',
        {
          className: `tier-${itier} ${tier === itier ? 'selected' : ''}`,
          onClick() {
            onChange(itier);
          },
          key: itier,
        },
        String(itier)
      )
    ))
  );
};

const CountSelect = ({ count, onChange }) => {
  function mapCountToColor(c) {
    if (c < 3) {
      return 1;
    } else if (c < 9) {
      return 2;
    } else {
      return 3;
    }
  }

  const out = [];
  for (let i = 0; i < 9; ++i) {
    const useStar = (i + 1) % 3 === 0 || i === 0;
    out.push(h(
      'span',
      {
        className: `count-select count-select-${mapCountToColor(i + 1)} count-select-${useStar ? 'star' : 'circle'}`,
        key: i,
        onClick() {
          onChange(i + 1);
        },
      },
      useStar ?
        (count > i ? '★' : '☆') :
        (count > i ? '●' : '○')
    ));
  }
  const input = h('span', { className: 'count-select-pips' }, out);

  return h('span', { className: 'count-select-wrapper' },
    h('div', { className: 'count-select-header' }, 'Count:'),
    input,
  );
};

const Stars = ({ stars }) => {
  stars = Math.max(Math.min(stars, 3), 0);
  const output = [];
  for (let i = 0; i < 3; ++i) {
    output.push(h('span',
      {
        className: 'star',
        key: i,
      },
      i < stars ? '★' : '☆',
    ));
  }
  return h('span', { className: `stars stars-${stars}` }, output);
};

const Metric = ({ quartiles }) => {
  return h('div', { className: 'quartiles' },
    h('div', null, quartiles[1]),
    h('div', null, h('span', null, quartiles[0]), h('span', null, quartiles[2]))
  );
};

const Percentage = ({ percentage }) => {
  percentage = Math.floor(Math.min(100, Math.max(0, percentage)));

  let range;
  if (percentage < 30) {
    range = 'low';
  } else if (percentage < 70) {
    range = 'medium';
  } else {
    range = 'high';
  }

  return h('div', { className: `percentage percentage-${range}` },
    h('div', { className: 'percentage-label' },
      percentage,
      h('span', { className: 'percentage-symbol' }, '%'),
    ),
    h('div', {
      className: `percentage-bar percentage-${range}`,
    }, h('div', { style: { width: `${percentage}%`} }))
  );
}

const Delete = ({ disabled = false, onClick }) => h('button', { className: 'delete', onClick, disabled }, '✕');

export default function () {
  ReactDOM.render(
    h(App, null),
    document.getElementById('container')
  );
}
