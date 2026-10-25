import { bi, type Local } from './courses'
type Fact = { term: string; meaning: Local; module: number }
const f = (term: string, en: string, ru: string, module: number): Fact => ({
  term,
  meaning: bi(en, ru),
  module,
})
export const facts: Record<string, Fact[]> = {
  python: [
    f(
      'int()',
      'Converts compatible text or a number to an integer.',
      'Преобразует подходящую строку или число в целое число.',
      0,
    ),
    f(
      '//',
      'Divides numbers and rounds the quotient down to an integer value.',
      'Делит числа и округляет частное вниз до целого значения.',
      0,
    ),
    f(
      '%',
      'Returns the remainder after division.',
      'Возвращает остаток от деления.',
      0,
    ),
    f(
      'input()',
      'Reads a line from standard input and returns a string.',
      'Считывает строку из стандартного ввода и возвращает str.',
      1,
    ),
    f(
      'list.append(x)',
      'Adds one item to the end of a mutable sequence.',
      'Добавляет один элемент в конец изменяемой последовательности.',
      1,
    ),
    f(
      'items[-1]',
      'Retrieves the final item in a nonempty sequence.',
      'Получает последний элемент непустой последовательности.',
      1,
    ),
    f(
      'items[1:3]',
      'Retrieves the items at indexes 1 and 2, excluding index 3.',
      'Получает элементы с индексами 1 и 2, исключая индекс 3.',
      1,
    ),
    f(
      'return',
      'Sends a result to the caller and exits the current function.',
      'Возвращает результат вызывающему коду и завершает текущую функцию.',
      2,
    ),
    f(
      'elif',
      'Tests another condition when earlier branches did not match.',
      'Проверяет следующее условие, если предыдущие ветви не подошли.',
      2,
    ),
    f(
      'def',
      'Starts a named function definition.',
      'Начинает определение именованной функции.',
      2,
    ),
    f(
      'range(1, 5)',
      'Produces the integer sequence 1, 2, 3, 4 when iterated.',
      'При переборе создаёт последовательность целых чисел 1, 2, 3, 4.',
      3,
    ),
    f(
      'break',
      'Exits the nearest enclosing loop immediately.',
      'Немедленно завершает ближайший охватывающий цикл.',
      3,
    ),
    f(
      'continue',
      'Skips the remaining statements in the current loop iteration.',
      'Пропускает оставшиеся команды текущей итерации цикла.',
      3,
    ),
    f(
      'while',
      'Repeats a block for as long as a condition stays true.',
      'Повторяет блок, пока условие остаётся истинным.',
      3,
    ),
    f(
      'with open(path)',
      'Uses a context manager to close a file reliably.',
      'Использует контекстный менеджер для надёжного закрытия файла.',
      4,
    ),
    f(
      "open(path, 'a')",
      'Opens a text file for writing at the end without truncating it.',
      'Открывает текстовый файл для дописывания без удаления содержимого.',
      4,
    ),
    f(
      'ValueError',
      'Can be raised by int() when given text such as "hello".',
      'Может возникнуть в int() при передаче строки вроде "hello".',
      4,
    ),
    f(
      'finally',
      'Runs its block when leaving try, whether or not an exception occurred.',
      'Выполняет свой блок при выходе из try независимо от исключения.',
      4,
    ),
    f(
      'import math',
      'Makes the standard mathematics module available by its module name.',
      'Подключает стандартный математический модуль под его именем.',
      5,
    ),
    f(
      'docstring',
      'Documents a module, class or function using its first string literal.',
      'Документирует модуль, класс или функцию первым строковым литералом.',
      5,
    ),
  ],
  databases: [
    f(
      'PRIMARY KEY',
      'Uniquely identifies a row and does not allow NULL.',
      'Уникально определяет строку и не допускает NULL.',
      0,
    ),
    f(
      'FOREIGN KEY',
      'Enforces a reference to a candidate key in a related table.',
      'Обеспечивает ссылочную целостность на потенциальный ключ связанной таблицы.',
      0,
    ),
    f(
      'Normalization',
      'Reduces redundant facts and update anomalies in relational tables.',
      'Уменьшает дублирование фактов и аномалии обновления таблиц.',
      0,
    ),
    f(
      'CREATE TABLE',
      'Defines a new table with columns and constraints.',
      'Определяет новую таблицу со столбцами и ограничениями.',
      1,
    ),
    f(
      'ALTER TABLE',
      'Changes the structure of an existing table.',
      'Изменяет структуру существующей таблицы.',
      1,
    ),
    f(
      'CHECK',
      'Rejects a row when a specified constraint condition evaluates to false.',
      'Отклоняет строку, если условие ограничения имеет значение false.',
      1,
    ),
    f(
      'NOT NULL',
      'Requires a column to contain a non-null value.',
      'Требует ненулевого значения в столбце.',
      1,
    ),
    f(
      'WHERE',
      'Filters individual rows before grouping.',
      'Фильтрует отдельные строки до группировки.',
      2,
    ),
    f(
      'ORDER BY',
      'Sorts a query result using the specified expressions.',
      'Сортирует результат запроса по указанным выражениям.',
      2,
    ),
    f(
      'IS NULL',
      'Tests whether a value is missing rather than comparing it with equals.',
      'Проверяет отсутствие значения вместо сравнения через знак равенства.',
      2,
    ),
    f(
      'DISTINCT',
      'Eliminates duplicate rows from a SELECT result.',
      'Убирает повторяющиеся строки результата SELECT.',
      2,
    ),
    f(
      'GROUP BY',
      'Partitions input rows into groups for aggregation.',
      'Разбивает строки на группы для агрегации.',
      3,
    ),
    f(
      'HAVING',
      'Filters groups after aggregation.',
      'Фильтрует группы после агрегации.',
      3,
    ),
    f(
      'COUNT(column)',
      'Counts non-null values in the specified column.',
      'Считает значения указанного столбца, исключая NULL.',
      3,
    ),
    f(
      'UNION ALL',
      'Combines compatible query results while keeping duplicates.',
      'Объединяет совместимые результаты запросов с сохранением повторов.',
      3,
    ),
    f(
      'LEFT JOIN',
      'Preserves every left-side row even when no right-side row matches.',
      'Сохраняет все строки слева даже без совпадения справа.',
      4,
    ),
    f(
      'INNER JOIN',
      'Returns combinations of rows satisfying the join condition.',
      'Возвращает сочетания строк, удовлетворяющие условию соединения.',
      4,
    ),
    f(
      'UPDATE',
      'Modifies existing rows; without WHERE it can affect every row.',
      'Изменяет существующие строки; без WHERE может затронуть все строки.',
      5,
    ),
    f(
      'ROLLBACK',
      'Undoes changes in the current uncommitted transaction.',
      'Отменяет изменения текущей незафиксированной транзакции.',
      5,
    ),
    f(
      'COMMIT',
      'Makes the current transaction changes permanent.',
      'Фиксирует изменения текущей транзакции.',
      5,
    ),
  ],
  networking: [
    f(
      'LAN',
      'Connects devices within a limited local geographic area.',
      'Соединяет устройства в ограниченной локальной области.',
      0,
    ),
    f(
      'WAN',
      'Connects networks across large geographic distances.',
      'Соединяет сети на больших географических расстояниях.',
      0,
    ),
    f(
      'Latency',
      'Measures the time delay involved in delivering data.',
      'Измеряет временную задержку передачи данных.',
      0,
    ),
    f(
      'TCP',
      'Provides ordered, reliable transport with retransmission.',
      'Обеспечивает упорядоченную надёжную доставку с повторной передачей.',
      1,
    ),
    f(
      'UDP',
      'Provides datagrams without built-in delivery or ordering guarantees.',
      'Передаёт датаграммы без встроенных гарантий доставки и порядка.',
      1,
    ),
    f(
      'OSI layer 3',
      'Handles logical addressing and routing of network packets.',
      'Отвечает за логическую адресацию и маршрутизацию пакетов.',
      1,
    ),
    f('IPv4', 'Uses 32-bit addresses.', 'Использует 32-битные адреса.', 2),
    f('IPv6', 'Uses 128-bit addresses.', 'Использует 128-битные адреса.', 2),
    f(
      '/24 IPv4 subnet',
      'Normally provides 254 usable host addresses in a conventional subnet.',
      'Обычно предоставляет 254 доступных адреса узлов в традиционной подсети.',
      2,
    ),
    f(
      'Default gateway',
      'Receives traffic destined for IP networks outside the local subnet.',
      'Получает трафик, предназначенный IP-сетям вне локальной подсети.',
      2,
    ),
    f(
      'Switch',
      'Typically forwards Ethernet frames using a MAC address table.',
      'Обычно пересылает кадры Ethernet по таблице MAC-адресов.',
      3,
    ),
    f(
      'Router',
      'Forwards IP packets between different networks.',
      'Пересылает IP-пакеты между разными сетями.',
      3,
    ),
    f(
      'Optical fiber',
      'Carries light signals and resists electromagnetic interference.',
      'Передаёт световые сигналы и устойчива к электромагнитным помехам.',
      3,
    ),
    f(
      'DNS',
      'Resolves domain names to IP addresses.',
      'Преобразует доменные имена в IP-адреса.',
      4,
    ),
    f(
      'DHCP',
      'Automatically leases IP configuration to clients.',
      'Автоматически выдаёт клиентам сетевые настройки в аренду.',
      4,
    ),
    f(
      'TCP port 443',
      'Is the conventional destination port for HTTPS traffic.',
      'Является стандартным портом назначения HTTPS.',
      4,
    ),
    f(
      'TCP port 22',
      'Is the conventional destination port for SSH traffic.',
      'Является стандартным портом назначения SSH.',
      4,
    ),
    f(
      'ping',
      'Tests reachability using ICMP echo requests.',
      'Проверяет доступность с помощью ICMP echo request.',
      5,
    ),
    f(
      'traceroute',
      'Helps identify the intermediate hops on a network path.',
      'Помогает определить промежуточные узлы сетевого маршрута.',
      5,
    ),
    f(
      'nslookup',
      'Queries DNS to help diagnose name-resolution problems.',
      'Запрашивает DNS для диагностики разрешения имён.',
      5,
    ),
  ],
  html5: [
    f(
      '<main>',
      'Identifies the principal content of an HTML document.',
      'Обозначает основное содержимое HTML-документа.',
      0,
    ),
    f(
      '<nav>',
      'Marks a section of primary navigation links.',
      'Обозначает раздел основных навигационных ссылок.',
      0,
    ),
    f(
      'alt',
      'Provides a text alternative for an image.',
      'Предоставляет текстовую альтернативу изображению.',
      0,
    ),
    f(
      '<label for="email">',
      'Associates a visible label with the control whose id is email.',
      'Связывает видимую подпись с полем, у которого id равен email.',
      0,
    ),
    f(
      'required',
      'Enables the native form check that a value must be supplied.',
      'Включает встроенную проверку обязательного заполнения поля.',
      1,
    ),
    f(
      '<canvas>',
      'Provides a bitmap drawing surface typically controlled by JavaScript.',
      'Предоставляет растровую поверхность для рисования через JavaScript.',
      1,
    ),
    f(
      '<svg>',
      'Describes scalable vector graphics as document elements.',
      'Описывает масштабируемую векторную графику элементами документа.',
      1,
    ),
    f(
      'padding',
      'Adds space between content and its border.',
      'Задаёт расстояние между содержимым и рамкой.',
      2,
    ),
    f(
      'margin',
      'Adds space outside the border of a CSS box.',
      'Задаёт расстояние за пределами рамки CSS-блока.',
      2,
    ),
    f(
      'box-sizing: border-box',
      'Includes border and padding within the declared width.',
      'Включает рамку и внутренние отступы в объявленную ширину.',
      2,
    ),
    f(
      '#menu',
      'Selects an element with the id menu in CSS.',
      'Выбирает в CSS элемент с id menu.',
      2,
    ),
    f(
      '@media',
      'Applies CSS rules conditionally, such as at a viewport width.',
      'Условно применяет CSS, например при определённой ширине экрана.',
      3,
    ),
    f(
      'display: grid',
      'Creates a layout system supporting explicit rows and columns.',
      'Создаёт систему раскладки с явными строками и столбцами.',
      3,
    ),
    f(
      'prefers-reduced-motion',
      'Detects a user preference for less animation.',
      'Определяет предпочтение пользователя уменьшить анимацию.',
      3,
    ),
    f(
      'document.querySelector()',
      'Returns the first matching element or null.',
      'Возвращает первый подходящий элемент или null.',
      4,
    ),
    f(
      'addEventListener()',
      'Registers a handler for an event on an event target.',
      'Регистрирует обработчик события для EventTarget.',
      4,
    ),
    f(
      'event.preventDefault()',
      'Cancels a cancelable event’s default browser action.',
      'Отменяет стандартное действие браузера для отменяемого события.',
      4,
    ),
    f(
      'textContent',
      'Sets plain text without interpreting it as HTML markup.',
      'Задаёт обычный текст без интерпретации HTML-разметки.',
      4,
    ),
    f(
      'sessionStorage',
      'Stores string values scoped to an origin and a tab session.',
      'Хранит строки в рамках origin и сессии вкладки.',
      5,
    ),
    f(
      'Service worker',
      'Can intercept network requests and implement offline caching.',
      'Может перехватывать сетевые запросы и реализовывать офлайн-кеш.',
      5,
    ),
  ],
  devices: [
    f(
      'RAM',
      'Holds volatile working data used by running programs.',
      'Хранит энергозависимые рабочие данные запущенных программ.',
      0,
    ),
    f(
      'SSD',
      'Stores data persistently without mechanical moving parts.',
      'Сохраняет данные без механических движущихся частей.',
      0,
    ),
    f(
      'HDMI',
      'Carries digital video and audio to compatible displays.',
      'Передаёт цифровое видео и звук на совместимые дисплеи.',
      0,
    ),
    f(
      'Device driver',
      'Enables an operating system to communicate with specific hardware.',
      'Обеспечивает взаимодействие ОС с конкретным оборудованием.',
      1,
    ),
    f(
      'Windows Update',
      'Delivers supported operating-system fixes and security updates.',
      'Доставляет исправления и обновления безопасности поддерживаемой ОС.',
      1,
    ),
    f(
      'UEFI',
      'Provides firmware services used to initialize hardware and start an OS.',
      'Предоставляет службы прошивки для инициализации оборудования и запуска ОС.',
      1,
    ),
    f(
      'NTFS',
      'Supports Windows file-system access-control lists.',
      'Поддерживает списки управления доступом файловой системы Windows.',
      2,
    ),
    f(
      'FAT32',
      'Limits a single file to a size smaller than 4 GiB.',
      'Ограничивает размер одного файла величиной меньше 4 ГиБ.',
      2,
    ),
    f(
      'Least privilege',
      'Grants only the access needed for a specific task.',
      'Предоставляет только права, необходимые для конкретной задачи.',
      2,
    ),
    f(
      'Standard user account',
      'Supports routine work without default administrative privileges.',
      'Позволяет выполнять повседневную работу без стандартных прав администратора.',
      3,
    ),
    f(
      'MFA',
      'Requires independent authentication factor types.',
      'Требует независимых типов факторов аутентификации.',
      3,
    ),
    f(
      'BitLocker',
      'Encrypts a Windows drive to protect stored data.',
      'Шифрует диск Windows для защиты сохранённых данных.',
      3,
    ),
    f(
      'Screen lock',
      'Protects an unattended interactive session from casual access.',
      'Защищает оставленный интерактивный сеанс от постороннего доступа.',
      3,
    ),
    f(
      'Full backup',
      'Copies all selected data in one backup operation.',
      'Копирует все выбранные данные за одну операцию резервирования.',
      4,
    ),
    f(
      'Incremental backup',
      'Copies data changed since the previous backup.',
      'Копирует данные, изменившиеся с предыдущего резервного копирования.',
      4,
    ),
    f(
      'Restore test',
      'Checks that backed-up data can actually be recovered.',
      'Проверяет возможность фактического восстановления резервной копии.',
      4,
    ),
    f(
      'Task Manager',
      'Shows running processes and resource utilization.',
      'Показывает процессы и использование ресурсов.',
      5,
    ),
    f(
      'Device Manager',
      'Shows hardware devices and their driver status.',
      'Показывает оборудование и состояние драйверов.',
      5,
    ),
    f(
      'Event Viewer',
      'Provides access to Windows event logs.',
      'Предоставляет доступ к журналам событий Windows.',
      5,
    ),
    f(
      'Safe Mode',
      'Starts Windows with a minimal set of drivers and services.',
      'Запускает Windows с минимальным набором драйверов и служб.',
      5,
    ),
  ],
}
export type Question = {
  id: string
  course: string
  module: number
  type: 'single' | 'multiple' | 'matching'
  prompt: Local
  options: Local[]
  labels?: string[]
  correct: number[]
  explanation: Local
}
export const questions: Question[] = Object.entries(facts).flatMap(
  ([course, bank]) =>
    bank.flatMap((fact, i) => {
      const next = bank[(i + 1) % bank.length],
        third = bank[(i + 7) % bank.length],
        wrong = bank[(i + 11) % bank.length]
      const pool = [fact, next, third, wrong]
      const shift = i % 4
      const options = [...pool.slice(shift), ...pool.slice(0, shift)]
      const terms = options.map((x) => bi(x.term, x.term))
      const single: Question = {
        id: `${course}-${i}-s`,
        course,
        module: fact.module,
        type: 'single',
        prompt: bi(
          `Choose the correct tool or concept for this requirement: ${fact.meaning.en}`,
          `Выберите инструмент или понятие для задачи: ${fact.meaning.ru}`,
        ),
        options: terms,
        correct: [options.indexOf(fact)],
        explanation: bi(
          `${fact.term}: ${fact.meaning.en}`,
          `${fact.term}: ${fact.meaning.ru}`,
        ),
      }
      const statements = [
        bi(
          `${fact.term}: ${fact.meaning.en}`,
          `${fact.term}: ${fact.meaning.ru}`,
        ),
        bi(
          `${next.term}: ${next.meaning.en}`,
          `${next.term}: ${next.meaning.ru}`,
        ),
        bi(
          `${third.term}: ${wrong.meaning.en}`,
          `${third.term}: ${wrong.meaning.ru}`,
        ),
        bi(
          `${wrong.term}: ${fact.meaning.en}`,
          `${wrong.term}: ${fact.meaning.ru}`,
        ),
      ]
      const rotated = [
        ...statements.slice(shift),
        ...statements.slice(0, shift),
      ]
      const multiple: Question = {
        id: `${course}-${i}-m`,
        course,
        module: fact.module,
        type: 'multiple',
        prompt: bi(
          'A student is reviewing these notes. Select the TWO technically correct statements.',
          'Студент проверяет конспект. Выберите ДВА технически верных утверждения.',
        ),
        options: rotated,
        correct: [
          rotated.indexOf(statements[0]),
          rotated.indexOf(statements[1]),
        ].sort((a, b) => a - b),
        explanation: bi(
          `${fact.term}: ${fact.meaning.en} ${next.term}: ${next.meaning.en}`,
          `${fact.term}: ${fact.meaning.ru} ${next.term}: ${next.meaning.ru}`,
        ),
      }
      const descriptions = [fact.meaning, next.meaning, third.meaning]
      const order = [
        [2, 0, 1],
        [1, 2, 0],
        [0, 2, 1],
        [2, 1, 0],
        [1, 0, 2],
        [0, 1, 2],
      ][i % 6]
      const matching: Question = {
        id: `${course}-${i}-p`,
        course,
        module: fact.module,
        type: 'matching',
        prompt: bi(
          'Match each concept to its correct description. Use each description once.',
          'Сопоставьте понятия с описаниями. Используйте каждое описание один раз.',
        ),
        options: order.map((n) => descriptions[n]),
        labels: [fact.term, next.term, third.term],
        correct: [0, 1, 2].map((n) => order.indexOf(n)),
        explanation: bi(
          `${fact.term}: ${fact.meaning.en} ${next.term}: ${next.meaning.en} ${third.term}: ${third.meaning.en}`,
          `${fact.term}: ${fact.meaning.ru} ${next.term}: ${next.meaning.ru} ${third.term}: ${third.meaning.ru}`,
        ),
      }
      return [single, multiple, matching]
    }),
)
export function isCorrect(q: Question, answer: number[] = []) {
  return (
    answer.length === q.correct.length &&
    (q.type === 'matching'
      ? answer.every((x, i) => x === q.correct[i])
      : [...answer]
          .sort((a, b) => a - b)
          .every((x, i) => x === [...q.correct].sort((a, b) => a - b)[i]))
  )
}
export function pickQuestions(course: string, count: number) {
  const pool = questions.filter((q) => q.course === course)
  // Stratify by topic so every module appears before drawing the remaining items.
  const shuffled = shuffle(pool)
  const required = Array.from({ length: 6 }, (_, i) =>
    shuffled.find((q) => q.module === i),
  ).filter((q): q is Question => !!q)
  return shuffle(
    [...required, ...shuffled.filter((q) => !required.includes(q))].slice(
      0,
      count,
    ),
  )
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
