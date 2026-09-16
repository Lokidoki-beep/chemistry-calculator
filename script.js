(() => {
  const $ = id => document.getElementById(id);
  const fmt = value => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(value);
  const chosenProducts = new Set();
  let orderItems = {};
  const clientCodes = {
  'NASP': 'nasp',
  'AZBUK': 'azbuk'
  };
// ПОКРЫТИЯ И ИХ КРИТЕРИИ
  const criteriaMatrix = {
  parquet:  ['base-prep', 'warm-floor', 'parquet-size'],
  massiv:   ['base-prep', 'warm-floor', 'massiv-size'],
  spc:      ['base-type', 'base-prep', 'warm-floor', 'wet-zone', 'surface'],
  lvt:      ['base-type', 'base-prep', 'warm-floor', 'wet-zone','type-fix','pvc-type'],
  /*linoleum: ['base-type', 'base-prep', 'type-linoleum'],
  laminate: ['base-type', 'base-prep'],*/
  cover:    ['base-type', 'base-prep', 'type-fix'],
  cork:     ['base-type', 'base-prep', 'surface']
  };
// ВИДЫ КРИТЕРИЕВ 
  const criteria = {
  'base-type': {name:'Тип основания',
    options:[
    {id:'absorbent', name:'Впитывающее'},
    {id:'non-absorbent', name:'Невпитывающее'}
      ]
  },
  'base-prep': {name:'Подготовка основания',
    options:[
      {id:'dedust', name:'Обеспылить'},
      {id:'strengthen-dedust', name:'Укрепить и обеспылить'},
      {id:'vapor-barrier', name:'Пароизоляция'}
    ]
  },
  'surface': {name:'Область применения',
    options:[
      {id:'floor', name:'Пол'},
      {id:'walls', name:'Стены'}
    ]
  },
  'warm-floor': {name:'Тёплый пол',
    options:[
      {id:'no', name:'Нет'},
      {id:'yes', name:'Да'}
    ]
  },
  'wet-zone': {name:'Влажная зона',
    options:[
      {id:'no', name:'Нет'},
      {id:'yes', name:'Да'}
    ]
  },
  'pvc-type': {name:'Тип ПВХ',
    options:[
      {id:'roll', name:'Рулонный'},
      {id:'tile', name:'Плитка'}
    ]
  },
  'type-fix': {name:'Тип монтажа',
    options:[
      {id:'glued', name:'Приклеивание'},
      {id:'fix', name:'Фиксация'}
    ]
  }, 
  'type-linoleum': {name:'Основа линолиума',
    options:[
      {id:'natur', name:'Натуральный'},
      {id:'fake', name:'ПВХ'}
    ]
  },        
  'parquet-size': {name:'Ширина паркета',
    options:[
      {id:'under-200', name:'Менее 200 мм'},
      {id:'over-200', name:'Более 200 мм'}
    ]
  },
  'massiv-size': {name:'Ширина массива',
    options:[
        {id:'under-160', name:'Менее 160 мм'},
      {id:'over-160', name:'Более 160 мм'}
    ]
  }
  };
// ПРОДУКТЫ И ПРИМЕНЕНИЕ
  const products = [
  // ГРУНТЫ
    {id: 'u-primer-150',
      type: 'primer',
      name: 'U-PRIMER 150',
      packs: [5],
      requires: {
      'base-prep': ['strengthen-dedust', 'vapor-barrier']
      },
      consumption: {
      all: {
        dedust: 100,
        'strengthen-dedust': 125,
        'vapor-barrier': 300
        }
      }
    },

    {id: 'd-plus',
      type: 'primer',
      name: 'D PLUS',
      packs: [5],
      requires: {
      'base-prep': ['dedust']
      },
      consumption: {all: {dedust: 150}}
    },

    {id: 'pu-primer-sf',
      type: 'primer',
      name: 'PU PRIMER SF',
      packs: [5],
      requires: {
      'base-prep': ['strengthen-dedust']
      },
      consumption: {
      all: {
        dedust: 100,
        'strengthen-dedust': 125
        }
      }
    },
    
    {id: 'primer-99',
      enabled: false,
      type: 'primer',
      name: 'PRIMER 99',
      packs: [10],
      requires: {
      'base-prep': ['dedust']
      },
      consumption: {all: {dedust: 100}}
    },

    {id: 'primer-pu-antidust',
      type: 'primer',
      name: 'PRIMER PU ANTIDUST',
      packs: [5],
      requires: {
      'base-prep': ['strengthen-dedust']
      },
      consumption: {
      all: {
        dedust: 150,
        'strengthen-dedust': 150
        }
      }
    },

    {id: 'primer-pu',
      enabled: false,
      type: 'primer',
      name: 'PRIMER PU',
      packs: [10],
      requires: {
      'base-prep': ['strengthen-dedust']
      },
      consumption: {
      all: {
        dedust: 150,
        'strengthen-dedust': 200,
        'vapor-barrier': 400
        }
      }
    },

    {id: 'primer-pu-150-speed',
      type: 'primer',
      name: 'PRIMER PU 150 SPEED',
      packs: [5],
      clientCodes: ['nasp'],
      requires: {
      'base-prep': ['strengthen-dedust', 'vapor-barrier']
      },
      consumption: {
      all: {
        dedust: 100,
        'strengthen-dedust': 125,
        'vapor-barrier': 400
        }
      }
    },

    {id: 'epoprimer',
      enabled: false,
      type: 'primer',
      name: 'EPOPRIMER',
      packs: [7.5],
      requires: {
      'base-prep': ['strengthen-dedust', 'vapor-barrier']
      },
      consumption: {
      all: {
        dedust: 125,
        'strengthen-dedust': 150,
        'vapor-barrier': 400
        }
      }
    },
  // КЛЕЙ ДЛЯ LVT / ПВХ
    {id: 'hycol-kd-fiber',
      type: 'adhesive',
      name: 'Hycol KD Fiber',
      covers: ['lvt'],
      packs: [5, 18],
      primer: 'd-plus',
      requires: {
      'base-type': ['absorbent'],
      'base-prep': ['dedust'],
      'surface': ['floor', 'walls'],
      'pvc-type': ['roll','tile'],
      'wet-zone': ['no']
      },
      consumption: {lvt: 300}
    },

    {id: 'hykostik-fiber',
      type: 'adhesive',
      name: 'Hycostik Fiber',
      covers: ['lvt','cover'],
      packs: [5, 18],
      requires: {
      'base-type': ['absorbent'],
      'base-prep': ['dedust'],
      'surface': ['floor', 'walls'],
      'pvc-type': ['tile'],
      'type-fix': ['fix', 'glued'],
      'wet-zone': ['no']
      },
      consumption: {
      lvt: 350,
      cover: {fix: 150, glued: 350}
      }
    },

    {id: 'hykostik',
      type: 'adhesive',
      name: 'Hycostik',
      covers: ['lvt'],
      packs: [5, 18],
      requires: {
      'base-type': ['absorbent'],
      'base-prep': ['dedust'],
      'surface': ['floor', 'walls'],
      'pvc-type': ['tile'],
      'type-fix': ['fix', 'glued'],
      'wet-zone': ['no']
      },
      consumption: {
      lvt: 350,
      cover: {fix: 150, glued: 350}
      }
    },

    {id: 'hycol-kd-4',
      enabled: false,
      type: 'adhesive',
      name: 'Hycol KD 4',
      covers: ['lvt','cover'],
      packs: [15],
      requires: {
      'base-type': ['absorbent'],
      'base-prep': ['dedust'],
      'surface': ['floor', 'walls'],
      'pvc-type': ['roll', 'tile'],
      'wet-zone': ['no']
      },
      consumption: {
      lvt: 350,
      cover: {fix: 150, glued: 350}
      }
    },

    {id: 'ecomastipren',
      type: 'adhesive',
      name: 'ECOMASTIPREN',
      covers: ['lvt', 'cork'],
      packs: [5],
      requires: {
      'base-type': ['absorbent', 'non-absorbent'],
      'base-prep': ['dedust'],
      'surface': ['floor', 'walls'],
      'pvc-type': ['roll', 'tile'],
      'wet-zone': ['no']
      },
      consumption: {
      lvt: 300,
      cork: 500
      }
    },

    {id: 'poliflex-spc',
      type: 'adhesive',
      name: 'Poliflex SPC',
      covers: ['spc', 'lvt'],
      packs: [5, 15],
      requires: {
      'base-type': ['absorbent', 'non-absorbent'],
      'surface': ['floor', 'walls'],
      'pvc-type': ['tile'],
      'wet-zone': ['no', 'yes']
      },
      consumption: {
        spc: 600,
        lvt: 300
      }
    },

    {id: 'gommapur',
      type: 'adhesive',
      name: 'Gommapur',
      covers: ['spc', 'lvt'],
      packs: [10],
      requires: {
      'base-type': ['absorbent', 'non-absorbent'],
      'surface': ['floor', 'walls'],
      'pvc-type': ['tile'],
      'wet-zone': ['no', 'yes']
      },
      consumption: {
        spc: 600,
        lvt: 300
      }
    },
  // КЛЕЙ ДЛЯ ПАРКЕТА / МАССИВА

    {id: 'smp-bond',
      type: 'adhesive',
      name: 'SMP BOND',
      covers: ['parquet', 'massiv'],
      packs: [15],
      clientCodes: ['nasp'],
      requires: {
        'parquet-size': ['under-200'],
        'massiv-size': ['under-160']
      },
      consumption: {
        parquet: {
          'under-200': 1200
        },
        massiv: {
          'under-160': 1200
        }
      }
    },
    {id: 'smp-bond-200',
      type: 'adhesive',
      name: 'SMP BOND 200',
      covers: ['parquet', 'massiv'],
      packs: [15],
      clientCodes: ['nasp'],
      requires: {
        'parquet-size': ['under-200', 'over-200'],
        'massiv-size': ['under-160', 'over-160']
      },
      consumption: {
        parquet: {
          'under-200': 1200,
          'over-200': 1200
        },
        massiv: {
          'under-160': 1500,
          'over-160': 1500
        }
      }
    },   
    {id: 'legnopol-2000',
      type: 'adhesive',
      name: 'Legnopol 2000',
      covers: ['parquet', 'massiv'],
      packs: [10],
      clientCodes: ['nasp'],
      requires: {
        'parquet-size': ['under-200', 'over-200'],
        'massiv-size': ['under-160', 'over-160']
      },
      consumption: {
        parquet: {
          'under-200': 1200,
          'over-200': 1200
        },
        massiv: {
          'under-160': 1500,
          'over-160': 1500
        }
      }
    },

    {id: 'legnopol-4000',
      type: 'adhesive',
      name: 'Legnopol 4000',
      covers: ['parquet', 'massiv'],
      packs: [10],
      clientCodes: ['nasp'],
      requires: {
        'parquet-size': ['under-200', 'over-200'],
        'massiv-size': ['under-160', 'over-160']
      },
      consumption: {
        parquet: {
          'under-200': 1200,
          'over-200': 1200
        },
        massiv: {
          'under-160': 1500,
          'over-160': 1500
        }
      }
    },
    {id: 'msp-bond',
      type: 'adhesive',
      name: 'MSP Bond',
      covers: ['parquet', 'massiv'],
      packs: [7, 14],
      clientCodes: ['azbuk'],
      requires: {
        'parquet-size': ['under-200'],
        'massiv-size': ['under-160']
      },
      consumption: {
        parquet: {'under-200': 1200},
        massiv: {'under-160': 1200}
      }
    }, 
    {id: 'optiflex',
      enabled: false,
      type: 'adhesive',
      name: 'OPTIFLEX',
      covers: ['parquet', 'massiv'],
      packs: [7, 14],
      clientCodes: ['azbuk'],
      requires: {
        'parquet-size': ['under-200'],
        'massiv-size': ['under-160']
      },
      consumption: {
        parquet: {'under-200': 1200},
        massiv: {'under-160': 1200}
      }
    },   
    {id: 's-bond-flex',
      type: 'adhesive',
      name: 'S-Bond Flex',
      covers: ['parquet', 'massiv'],
      packs: [7, 14],
      requires: {
        'parquet-size': ['under-200'],
        'massiv-size': ['under-160']
      },
      consumption: {
        parquet: {'under-200': 1200},
        massiv: {'under-160': 1200}
      }
    },
    {id: 'u-bond-special-x-treme',
      enabled: false,
      type: 'adhesive',
      name: 'U-BOND SPECIAL X-TREME',
      covers: ['parquet', 'massiv', 'laminate'],
      packs: [16],
      requires: {
        'parquet-size': ['under-200', 'over-200'],
        'massiv-size': ['under-160', 'over-160']
      },
      consumption: {
      parquet: {
        'under-200': 1200,
        'over-200': 1200
      },
      massiv: {
        'under-160': 1200,
        'over-160': 1500
      },
      laminate: 1100
      }
    },
    {id: 'bona-r-820',
      type: 'adhesive',
      name: 'Bona R-820',
      covers: ['parquet', 'massiv'],
      packs: [15],
      requires: {
        'parquet-size': ['under-200', 'over-200'],
        'massiv-size': ['under-160', 'over-160']
      },
      consumption: {
        parquet: {
          'under-200': 1200,
          'over-200': 1200
        },
        massiv: {
          'under-160': 1500,
          'over-160': 1500
        }
      }
    },
    {id: 'sipol',
      enabled: false,
      type: 'adhesive',
      name: 'SIPOL',
      covers: ['parquet', 'massiv'],
      packs: [10],
      requires: {
        'parquet-size': ['under-200', 'over-200'],
        'massiv-size': ['under-160', 'over-160']
      },
      consumption: {
        parquet: {
          'under-200': 1200,
          'over-200': 1200
        },
        massiv: {
          'under-160': 1500,
          'over-160': 1500
        }
      }
    },
    {id: 'izopur-2k',
      type: 'adhesive',
      name: 'IZOPUR 2K',
      covers: ['parquet', 'massiv'],
      packs: [10],
      requires: {
        'parquet-size': ['under-200', 'over-200'],
        'massiv-size': ['under-160', 'over-160']
      },
      consumption: {
        parquet: {
          'under-200': 1200,
          'over-200': 1200
        },
        massiv: {
          'under-160': 1500,
          'over-160': 1500
        }
      }
    },

    {id: 'izopur-2k-ultima',
      enabled: false,
      type: 'adhesive',
      name: 'IZOPUR 2K ULTIMA',
      covers: ['parquet', 'massiv'],
      packs: [10],
      requires: {
        'parquet-size': ['under-200', 'over-200'],
        'massiv-size': ['under-160', 'over-160']
      },
      consumption: {
        parquet: {
          'under-200': 1200,
          'over-200': 1200
        },
        massiv: {
          'under-160': 1500,
          'over-160': 1500
        }
      }
    },    
    ];
// ВЫВОД КРИТЕРИЕВ ПО ПОКРЫТИЮ
  function drawCriteria() {
    const cover = $('covering').value;
    const host = $('criteria');
    const woodWidth = $('woodWidth');
    host.innerHTML = '';
    woodWidth.innerHTML = '';
    $('criteriaCard').classList.toggle('hidden', !cover);
    (criteriaMatrix[cover] || []).forEach(criterionId => {
      const criterion = criteria[criterionId];
      if (!criterion) return;
      const options = criterion.options
        .map(option => `<option value="${option.id}">${option.name}</option>`)
        .join('');
      if (
        (cover === 'parquet' && criterionId === 'parquet-size') ||
        (cover === 'massiv' && criterionId === 'massiv-size') ||
        (cover === 'lvt' && criterionId === 'pvc-type')
      ) {
        woodWidth.innerHTML = `
          <label>${criterion.name}
            <select data-criterion="${criterionId}">
              <option value="">Выберите вариант</option>
              ${options}
            </select>
          </label>
        `;
        return;
      }
      host.insertAdjacentHTML('beforeend', `
        <div class="criterion">
          <label>${criterion.name}
            <select data-criterion="${criterionId}">
              <option value="">Выберите вариант</option>
              ${options}
            </select>
          </label>
        </div>
      `);
    });
  }
// РАСЧЁТ ТАРЫ
  function packPlan(required, packs) {
  const big = Math.max(...packs);
  const small = packs
    .filter(size => size < big)
    .sort((a, b) => b - a)[0];
  let bigCount = Math.floor(required / big);
  const remaining = +(required - bigCount * big).toFixed(6);
  const plan = [];

  if (remaining > 0) {
    if (remaining > big * 0.8 || !small) {
      bigCount++;
    } else {
      plan.push({
        size: small,
        count: Math.ceil(remaining / small)
      });
    }
  }

  if (bigCount) {
    plan.unshift({
      size: big,
      count: bigCount
    });
  }
  return plan;
  }
// ПОЛУЧЕНИЕ ОТВЕТОВ КЛИЕНТА
  function getAnswers() {
  return Object.fromEntries(
    [...document.querySelectorAll('[data-criterion]')]
      .map(element => [
        element.dataset.criterion,
        element.value
      ]));
  }
// ОПРЕДЕЛЕНИЕ КОДА КОМПАНИИ
  function getClientCode() {
    const legalEntity = $('legalEntity').value.trim().toUpperCase();
    return clientCodes[legalEntity] || null;
  }
// ПРОВЕРКА ТРЕБОВАНИЙ ПРОДУКТА
  function matchesRequires(product, answers, cover) {
  const activeCriteria = new Set(criteriaMatrix[cover] || []);
  return Object.entries(product.requires || {}).every(([criterionId, allowed]) => {
    if (!activeCriteria.has(criterionId)) return true;
    const answer = answers[criterionId];
    if (!answer) return true;
    const allowedValues = Array.isArray(allowed)
      ? allowed
      : [allowed];
    return allowedValues.includes(answer);
  });
  }
// ПОДБОР ПОДХОДЯЩИХ ПРОДУКТОВ
  function getSuitableProducts(cover, answers) {
    const clientCode = getClientCode();
    return products.filter(product => 
    {
      if (product.enabled === false) return false;
      if (product.covers?.length &&!product.covers.includes(cover)) 
        {return false;}
      if (!matchesRequires(product, answers, cover)) 
        {return false;}
      if (product.clientCodes?.length) 
      {
      if (!clientCode || !product.clientCodes.includes(clientCode)) 
        {return false;}
      }
      return true;
    });
  }
// ПОЛУЧЕНИЕ РАСХОДА КОНКРЕТНОГО ПРОДУКТА
  function getConsumption(product, cover, answers) 
  {
    const consumption = product.consumption;
    if (!consumption) return null;
    const data = consumption[cover] ?? consumption.all;
    if (typeof data === 'number') 
    {return data;}
    if (!data || typeof data !== 'object') 
    {return null;}
    const criteriaIds = criteriaMatrix[cover] || [];
    for (const criterionId of criteriaIds) 
    {
      const answer = answers[criterionId];
      if (answer &&typeof data[answer] === 'number') 
      {return data[answer];}
    }
    return null;
  }
// РАСЧЁТ КОНКРЕТНОГО ПРОДУКТА И ТАРЫ
  function calculateProduct(product, area, cover, answers, unit) {
  const consumption = getConsumption(
    product,
    cover,
    answers
  );
  if (!Number.isFinite(consumption)) {
    return {
      consumption: null,
      required: null,
      plan: [],
      purchase: null,
      total: null
    };
  }
  const required = area * consumption / 1000;
  const plan = packPlan(
    required,
    product.packs
  );
  return {
    consumption,
    required,
    plan,
    purchase: plan
      .map(item => `${item.count} × ${item.size} ${unit}`)
      .join(' + '),
    total: plan.reduce(
      (sum, item) => sum + item.size * item.count,
      0
    )
  };
  }
// ВЫВОД КАРТОЧКИ ПРОДУКТА
  function renderProduct(product, result, unit, cover) {
    const id = `${product.type}:${product.id}`;
    if (!result) return '';
    const hasConsumption = Number.isFinite(result.consumption);
    const isClientProduct =product.clientCodes?.length > 0;
    return `
    <div class="item${isClientProduct ? ' client-product' : ''}">
      <label class="select-product">
        <input
          type="checkbox"
          aria-label="${product.name}"
          data-product-id="${id}"
          ${chosenProducts.has(id) ? 'checked' : ''}
          ${!hasConsumption ? 'disabled' : ''}
        >
      </label>
      <div class="product-info">
        <strong>${product.name}</strong>
        ${hasConsumption
            ? `
              <div class="pack">Купить: ${result.purchase} </div>
              <div class="note">При расходе: ${fmt(result.consumption)} ${unit}/м² </div>
              ` 
              : `
              <div class="note">${
                product.type === 'primer'
                  ? 'Укажите необходимые условия подготовки основания.'
                  : cover === 'parquet'
                    ? 'Выберите ширину паркета для расчета.'
                    : cover === 'massiv'
                      ? 'Выберите ширину массива для расчета.'
                      : cover === 'lvt'
                        ? 'Выберите тип ПВХ для расчета.'
                        : ''
              }
              </div>
            `
        }
      </div>
    </div>`;
  }
// ФОРМИРОВАНИЕ ТЕКСТА ЗАКАЗА
  function updateOrderText() {
  const legalEntity = $('legalEntity').value.trim() || 'не указано';
  const items = [...chosenProducts]
    .map(id => orderItems[id])
    .filter(Boolean);
  const lines = items
    .map(item => `${item.name} — ${item.purchase}`)
    .join('\n');
  $('orderText').value = items.length
    ? `Заказ от: ${legalEntity}\n\nТовар\n${lines}`
    : `Заказ от: ${legalEntity}\n\nТовар`;
  }
// РАСЧЁТ КАЛЬКУЛЯТОРА
  function calculate(showErrors = false) {
  const cover = $('covering').value;
  const area = parseFloat($('area').value);
  const answers = getAnswers();
  if (!cover) {
    if (showErrors) {
      alert('Выберите тип покрытия.');
    }
    return;
  }
  if (!(area > 0)) {
    if (showErrors) {
      alert('Введите площадь больше нуля.');
    }
    return;
  }
  const suitable = getSuitableProducts(
    cover,
    answers
  );
  const vaporBarrierWarmFloor =
    answers['base-prep'] === 'vapor-barrier' &&
    answers['warm-floor'] === 'yes';
  const calculateResults = (type, unit) => suitable
    .filter(product => product.type === type)
    .map(product => ({
    product,
    result: calculateProduct(
    product,
    area,
    cover,
    answers,
    unit
    )
  }));
    const primerResults = vaporBarrierWarmFloor
    ? []
    : calculateResults(
        'primer',
        'л'
      );
  const adhesiveResults = calculateResults(
    'adhesive',
    'кг'
  );
  orderItems = {};
  [...primerResults, ...adhesiveResults].forEach(({ product, result }) => {
    orderItems[
      `${product.type}:${product.id}`
    ] = {
      name: product.name,
      purchase: result.purchase
    };
  });
  [...chosenProducts].forEach(id => {
    if (!orderItems[id]) {
      chosenProducts.delete(id);
    }
  });
  $('primers').innerHTML = vaporBarrierWarmFloor
    ? '<div class="item empty">Пароизоляция несовместима с тёплым полом.</div>'
    : primerResults.length
      ? primerResults
          .map(({ product, result }) =>
            renderProduct(product, result, 'л', cover)
          )
          .join('')
      : '<div class="item empty">Подходящие грунты не найдены.</div>';
  $('adhesives').innerHTML = adhesiveResults.length
    ? adhesiveResults
        .map(({ product, result }) =>
          renderProduct(product, result, 'кг', cover)
        )
        .join('')
    : '<div class="item empty">Для расчёта клея выберите необходимые критерии.</div>';
  updateOrderText();
  $('results').classList.remove('hidden');
  if (
    showErrors &&
    !primerResults.length &&
    !adhesiveResults.length
  ) {
    alert(
      'По выбранным условиям пока нечего рассчитать. Заполните критерии, которые влияют на нужный продукт.'
    );
  }
  }
// МОМЕНТАЛЬНОЕ ОБНОВЛЕНИЕ
  function refresh() 
  {
    drawCriteria();
    if (!$('covering').value) {
      $('results').classList.add('hidden');
      $('primers').innerHTML = '';
      $('adhesives').innerHTML = '';
      $('primerConsumption').innerHTML = '';
      $('adhesiveConsumption').innerHTML = '';
      chosenProducts.clear();
      orderItems = {};
      updateOrderText();
      return;
    }
    calculate(false);
  }
  $('covering').addEventListener('change',refresh);
  $('area').addEventListener('input',() => {calculate(false);});
  document.addEventListener('change',
  event => 
  {
    if (event.target.matches('[data-criterion]')) {calculate(false);}
    if (event.target.matches('[data-product-id]')) 
    {
      const id = event.target.dataset.productId;
      if (event.target.checked) {chosenProducts.add(id);}
      else {chosenProducts.delete(id);}
      updateOrderText();
    }
  }
  );
  $('legalEntity').addEventListener('input',() => {updateOrderText();calculate(false);});
  $('copyOrder').addEventListener('click',
    async () => {const text = $('orderText').value;
    try 
      {
      await navigator.clipboard.writeText(text);
      $('copyOrder').textContent = 'Скопировано';
      setTimeout(() => {$('copyOrder').textContent = 'Скопировать заказ';}, 1600);
      } 
      catch {$('orderText').select();document.execCommand('copy');}}
  );
  $('calculate').addEventListener('click',() => {calculate(true);}
);
})();