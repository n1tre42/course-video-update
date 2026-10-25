export type Lang = 'en' | 'ru'
export type Local = { en: string; ru: string }
export const bi = (en: string, ru: string): Local => ({ en, ru })
export type Lesson = {
  id: string
  title: Local
  notes: Local
  video: string
  start: number
  end: number
  resource: string
}
export type Course = {
  id: string
  title: Local
  category: 'Development' | 'Infrastructure'
  description: Local
  color: string
  symbol: string
  range: string
  examCount: number
  objective: string
  lessons: Lesson[]
}
const lesson = (
  id: string,
  title: Local,
  notes: Local,
  video: string,
  start: number,
  end: number,
  resource: string,
): Lesson => ({ id, title, notes, video, start, end, resource })
export const courses: Course[] = [
  {
    id: 'python',
    title: bi('Python', 'Python'),
    category: 'Development',
    description: bi(
      'Turn your first lines of code into problem-solving skills.',
      'От первых строк кода к решению практических задач.',
    ),
    color: 'yellow',
    symbol: 'python',
    range: '33–43',
    examCount: 38,
    objective: 'python',
    lessons: [
      lesson(
        'py1',
        bi('Data types & operators', 'Типы данных и операторы'),
        bi(
          'Python distinguishes strings, integers, floating-point numbers and booleans. input() always returns text: convert it before arithmetic. / produces a float, // performs floor division, and % returns the remainder. Try: predict the type and value of 7 // 2 and 7 / 2.',
          'Python различает строки, целые и дробные числа, логические значения. input() возвращает строку: перед вычислением используйте int() или float(). / — обычное деление, // — деление с округлением вниз, % — остаток. Практика: определите тип и значение 7 // 2 и 7 / 2.',
        ),
        'rfscVS0vtbw',
        906,
        2706,
        'https://docs.python.org/3/tutorial/introduction.html',
      ),
      lesson(
        'py2',
        bi('Lists, strings & input', 'Списки, строки и ввод'),
        bi(
          'Sequence indexing begins at zero. A slice includes its start and excludes its stop. Lists are mutable; strings and tuples are immutable. Practice creating a list, appending an item and reading the final item with [-1].',
          'Индексы начинаются с нуля. Срез включает начало, но исключает конец. Списки изменяемы, строки и кортежи — нет. Создайте список, добавьте элемент через append() и получите последний элемент через [-1].',
        ),
        'rfscVS0vtbw',
        3157,
        4737,
        'https://docs.python.org/3/library/stdtypes.html',
      ),
      lesson(
        'py3',
        bi('Functions & decisions', 'Функции и условия'),
        bi(
          'Define reusable behavior with def. A return statement sends a value back to the caller; print only displays it. if/elif/else chooses a branch using boolean expressions. Indentation defines blocks. Practice a function that returns the larger of two numbers.',
          'Функция определяется через def. return возвращает результат вызывающему коду; print только выводит его. if/elif/else выбирает ветвь по логическому условию. Отступы задают блоки. Напишите функцию, возвращающую большее из двух чисел.',
        ),
        'rfscVS0vtbw',
        5055,
        6847,
        'https://docs.python.org/3/tutorial/controlflow.html',
      ),
      lesson(
        'py4',
        bi('Loops & iteration', 'Циклы и итерация'),
        bi(
          'A while loop repeats while its condition is true. A for loop traverses an iterable. range(1, 5) yields 1, 2, 3, 4. break exits a loop; continue skips the rest of one iteration. Trace variables on paper to detect off-by-one errors.',
          'while повторяется, пока условие истинно. for перебирает итерируемый объект. range(1, 5) даёт 1, 2, 3, 4. break прерывает цикл, continue переходит к следующей итерации. Проследите значения переменных, чтобы найти ошибку границ.',
        ),
        'rfscVS0vtbw',
        8053,
        9680,
        'https://docs.python.org/3/tutorial/controlflow.html#for-statements',
      ),
      lesson(
        'py5',
        bi('Files & exception handling', 'Файлы и исключения'),
        bi(
          'Use with open(...) to close files reliably. Mode r reads; w replaces existing contents; a appends. Catch specific exceptions, such as ValueError or FileNotFoundError. finally runs whether an exception occurred or not. Never catch an error silently when the caller needs to know.',
          'with open(...) гарантирует закрытие файла. Режим r читает, w заменяет содержимое, a дописывает. Перехватывайте конкретные исключения: ValueError или FileNotFoundError. finally выполняется независимо от ошибки. Не скрывайте ошибку, если она важна вызывающему коду.',
        ),
        'rfscVS0vtbw',
        11057,
        12493,
        'https://docs.python.org/3/tutorial/errors.html',
      ),
      lesson(
        'py6',
        bi('Modules & code structure', 'Модули и структура кода'),
        bi(
          'Import reusable code with import or from ... import. The standard library includes math, random and datetime. A module is a Python file. Use descriptive names, docstrings and small functions. Review the difference between syntax errors, runtime exceptions and incorrect logic.',
          'Подключайте код через import или from ... import. В стандартной библиотеке есть math, random, datetime. Модуль — это файл Python. Используйте понятные имена, docstring и небольшие функции. Различайте синтаксические ошибки, исключения времени выполнения и логические ошибки.',
        ),
        'rfscVS0vtbw',
        12493,
        13436,
        'https://docs.python.org/3/tutorial/modules.html',
      ),
    ],
  },
  {
    id: 'databases',
    title: bi('Databases', 'Базы данных'),
    category: 'Development',
    description: bi(
      'Design better tables. Ask smarter questions with SQL.',
      'Проектируйте таблицы и получайте ответы с помощью SQL.',
    ),
    color: 'mint',
    symbol: 'database',
    range: '35–45',
    examCount: 40,
    objective: 'database',
    lessons: [
      lesson(
        'db1',
        bi('Relational foundations', 'Основы реляционных баз'),
        bi(
          'A relational database stores rows in tables. A primary key uniquely identifies a row; a foreign key refers to another key. Model a one-to-many relationship by putting the foreign key on the many side. Reduce repeated facts with normalization.',
          'Реляционная база хранит строки в таблицах. Первичный ключ уникально определяет строку; внешний ссылается на ключ другой таблицы. В связи один-ко-многим внешний ключ располагается на стороне «много». Нормализация уменьшает дублирование фактов.',
        ),
        'HXV3zeQKqGY',
        156,
        1390,
        'https://www.postgresql.org/docs/current/ddl.html',
      ),
      lesson(
        'db2',
        bi('Tables, keys & constraints', 'Таблицы, ключи и ограничения'),
        bi(
          'CREATE TABLE defines a table. NOT NULL forbids missing values, UNIQUE prevents duplicates and CHECK validates a condition. Choose appropriate data types. ALTER changes a definition; DROP removes an object. Practice creating students and enrollments tables.',
          'CREATE TABLE определяет таблицу. NOT NULL запрещает отсутствие значения, UNIQUE — дубликаты, CHECK проверяет условие. Выбирайте подходящие типы данных. ALTER изменяет структуру, DROP удаляет объект. Создайте таблицы students и enrollments.',
        ),
        'HXV3zeQKqGY',
        4549,
        6349,
        'https://www.postgresql.org/docs/current/ddl-constraints.html',
      ),
      lesson(
        'db3',
        bi('SELECT, filtering & sorting', 'SELECT, фильтрация и сортировка'),
        bi(
          'SELECT chooses columns, WHERE filters rows and ORDER BY sorts the result. Use IS NULL rather than = NULL. Parenthesize combinations of AND and OR. DISTINCT removes duplicate result rows. Write a query that lists students with scores above 80.',
          'SELECT выбирает столбцы, WHERE фильтрует строки, ORDER BY сортирует результат. Проверяйте пропуски через IS NULL, а не = NULL. Используйте скобки с AND и OR. DISTINCT удаляет повторы. Выведите студентов с результатом выше 80.',
        ),
        'HXV3zeQKqGY',
        6971,
        7871,
        'https://www.postgresql.org/docs/current/queries.html',
      ),
      lesson(
        'db4',
        bi('Aggregates & set operations', 'Агрегаты и операции с множествами'),
        bi(
          'COUNT, SUM and AVG summarize data. GROUP BY creates groups; HAVING filters groups after aggregation. UNION combines compatible result sets and removes duplicates. UNION ALL retains duplicates. COUNT(column) ignores NULL values.',
          'COUNT, SUM и AVG обобщают данные. GROUP BY создаёт группы, HAVING фильтрует их после агрегации. UNION объединяет совместимые результаты и убирает повторы; UNION ALL сохраняет их. COUNT(column) не учитывает NULL.',
        ),
        'HXV3zeQKqGY',
        9027,
        10827,
        'https://www.postgresql.org/docs/current/functions-aggregate.html',
      ),
      lesson(
        'db5',
        bi('JOINs & subqueries', 'JOIN и подзапросы'),
        bi(
          'INNER JOIN returns matching rows. LEFT JOIN preserves every left row, using NULL for missing right matches. A subquery supplies a value or set to an outer query. Be careful: a WHERE filter on the right table can remove unmatched left rows.',
          'INNER JOIN возвращает совпадения. LEFT JOIN сохраняет все строки слева и подставляет NULL при отсутствии совпадения справа. Подзапрос передаёт значение или набор во внешний запрос. Фильтр WHERE по правой таблице может удалить несовпавшие строки.',
        ),
        'HXV3zeQKqGY',
        10896,
        12112,
        'https://www.postgresql.org/docs/current/queries-table-expressions.html',
      ),
      lesson(
        'db6',
        bi('Data changes & integrity', 'Изменение данных и целостность'),
        bi(
          'INSERT adds rows; UPDATE changes them; DELETE removes them. Without WHERE, UPDATE and DELETE affect every row. A transaction groups changes: COMMIT saves and ROLLBACK undoes uncommitted work. A foreign key prevents orphan references.',
          'INSERT добавляет строки, UPDATE изменяет, DELETE удаляет. Без WHERE команды UPDATE и DELETE затрагивают все строки. Транзакция объединяет изменения: COMMIT сохраняет, ROLLBACK отменяет незафиксированное. Внешний ключ предотвращает ссылки на несуществующие записи.',
        ),
        'HXV3zeQKqGY',
        6491,
        7717,
        'https://www.postgresql.org/docs/current/tutorial-transactions.html',
      ),
    ],
  },
  {
    id: 'networking',
    title: bi('Networking', 'Сети'),
    category: 'Infrastructure',
    description: bi(
      'Understand the connections that keep everything moving.',
      'Разберитесь в соединениях, протоколах и сетевых устройствах.',
    ),
    color: 'lavender',
    symbol: 'network',
    range: '35–45',
    examCount: 40,
    objective: 'networking',
    lessons: [
      lesson(
        'net1',
        bi('Networks & topologies', 'Сети и топологии'),
        bi(
          'LAN connects devices in a local area; WAN connects distant networks. In a star topology devices connect to a central switch. Understand bandwidth versus latency, and client-server versus peer-to-peer organization.',
          'LAN объединяет устройства в локальной области; WAN соединяет удалённые сети. В топологии «звезда» устройства подключены к центральному коммутатору. Различайте пропускную способность и задержку, клиент-серверную и одноранговую модели.',
        ),
        'qiQR5rTSshw',
        6208,
        7362,
        'https://www.cisco.com/site/us/en/learn/topics/networking/what-is-computer-networking.html',
      ),
      lesson(
        'net2',
        bi('The OSI & TCP/IP models', 'Модели OSI и TCP/IP'),
        bi(
          'The OSI model separates seven layers. Switches commonly forward Ethernet frames at layer 2; routers route IP packets at layer 3. TCP supplies ordered, reliable transport; UDP has lower overhead without delivery guarantees.',
          'Модель OSI разделяет взаимодействие на семь уровней. Коммутаторы обычно пересылают кадры Ethernet на уровне 2, маршрутизаторы — IP-пакеты на уровне 3. TCP обеспечивает надёжную упорядоченную доставку, UDP не гарантирует её.',
        ),
        'qiQR5rTSshw',
        27813,
        28715,
        'https://developer.mozilla.org/en-US/docs/Glossary/TCP',
      ),
      lesson(
        'net3',
        bi('IPv4, IPv6 & subnetting', 'IPv4, IPv6 и подсети'),
        bi(
          'IPv4 addresses contain 32 bits; IPv6 uses 128. A prefix length identifies network bits. A /24 IPv4 subnet has 256 addresses, usually 254 assignable hosts. A default gateway routes traffic outside the local subnet.',
          'В IPv4 адрес содержит 32 бита, в IPv6 — 128. Длина префикса определяет сетевую часть. Подсеть IPv4 /24 содержит 256 адресов, обычно 254 адреса узлов. Шлюз по умолчанию направляет трафик за пределы локальной подсети.',
        ),
        'qiQR5rTSshw',
        6986,
        8770,
        'https://developer.mozilla.org/en-US/docs/Glossary/IP_Address',
      ),
      lesson(
        'net4',
        bi('Hardware, cables & wireless', 'Оборудование, кабели и Wi-Fi'),
        bi(
          'A switch connects LAN devices; a router connects IP networks; an access point connects wireless clients. Copper Ethernet commonly uses RJ-45 connectors. Fiber resists electromagnetic interference. Match cable capability and distance to the installation.',
          'Коммутатор соединяет узлы LAN, маршрутизатор — IP-сети, точка доступа — беспроводные устройства. Медный Ethernet обычно использует RJ-45. Оптоволокно устойчиво к электромагнитным помехам. Подбирайте кабель с учётом скорости и расстояния.',
        ),
        'qiQR5rTSshw',
        4952,
        6208,
        'https://www.cisco.com/site/us/en/learn/topics/networking/what-is-a-network-switch.html',
      ),
      lesson(
        'net5',
        bi('DNS, DHCP & network services', 'DNS, DHCP и сетевые службы'),
        bi(
          'DNS resolves names to addresses. DHCP leases IP settings automatically. HTTPS uses TCP port 443, HTTP 80 and SSH 22. Know the difference between a name-resolution failure and an IP connectivity failure.',
          'DNS преобразует имена в адреса. DHCP автоматически выдаёт сетевые настройки. HTTPS использует TCP-порт 443, HTTP — 80, SSH — 22. Различайте сбой разрешения имён и отсутствие IP-связности.',
        ),
        'qiQR5rTSshw',
        912,
        2712,
        'https://developer.mozilla.org/en-US/docs/Glossary/DNS',
      ),
      lesson(
        'net6',
        bi('Security & troubleshooting', 'Безопасность и диагностика'),
        bi(
          'Use WPA3 where supported, strong credentials and least privilege. ping checks ICMP reachability; traceroute identifies hops; ipconfig shows local configuration; nslookup checks DNS. Start troubleshooting with the physical link before changing software settings.',
          'Применяйте WPA3 при поддержке, сложные пароли и минимальные привилегии. ping проверяет доступность по ICMP, traceroute показывает узлы маршрута, ipconfig — настройки, nslookup — DNS. Начинайте диагностику с физического подключения.',
        ),
        'qiQR5rTSshw',
        22962,
        24219,
        'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig',
      ),
    ],
  },
  {
    id: 'html5',
    title: bi('HTML5 Development', 'Разработка HTML5'),
    category: 'Development',
    description: bi(
      'Build interactive web experiences, from markup to browser APIs.',
      'Создавайте веб-приложения: от разметки до API браузера.',
    ),
    color: 'peach',
    symbol: 'html',
    range: '33–44',
    examCount: 39,
    objective: 'htmlappdevelopment',
    lessons: [
      lesson(
        'web1',
        bi('Semantic HTML & documents', 'Семантический HTML'),
        bi(
          'Use semantic elements such as main, nav, article and footer to express document structure. Headings form a hierarchy. Associate labels with form controls. Meaningful alt text describes useful images; decorative images use an empty alt attribute.',
          'Семантические main, nav, article и footer описывают структуру. Заголовки образуют иерархию. Связывайте label с полями формы. Для содержательных изображений задавайте осмысленный alt, для декоративных — пустой.',
        ),
        'pQN-pnXPaVg',
        2887,
        4053,
        'https://developer.mozilla.org/en-US/docs/Web/HTML',
      ),
      lesson(
        'web2',
        bi('Forms, media & graphics', 'Формы, медиа и графика'),
        bi(
          'Use input types and required for native validation, then validate again on the server. Audio and video support native controls. Canvas draws a bitmap through JavaScript; SVG describes scalable vector shapes.',
          'Типы input и required обеспечивают встроенную проверку; сервер должен проверить данные повторно. audio и video поддерживают controls. Canvas рисует растровое изображение через JavaScript, SVG описывает масштабируемую векторную графику.',
        ),
        'pQN-pnXPaVg',
        6294,
        7352,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input',
      ),
      lesson(
        'web3',
        bi('CSS selectors & the box model', 'Селекторы CSS и блочная модель'),
        bi(
          'The cascade resolves competing declarations using origin, importance, specificity and order. The box model consists of content, padding, border and margin. box-sizing: border-box includes padding and border inside the declared width.',
          'Каскад учитывает источник, важность, специфичность и порядок. Блочная модель включает content, padding, border и margin. box-sizing: border-box включает padding и border в объявленную ширину.',
        ),
        '1Rs2ND1ryYc',
        10147,
        11717,
        'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model',
      ),
      lesson(
        'web4',
        bi('Responsive layouts & animation', 'Адаптивные макеты и анимация'),
        bi(
          'Use media queries to adapt styles to viewport conditions. Flexbox lays out items along one main axis; Grid supports rows and columns. Prefer transform and opacity for animations and respect prefers-reduced-motion.',
          'Медиазапросы адаптируют стили к условиям экрана. Flexbox располагает элементы вдоль основной оси, Grid задаёт строки и столбцы. Для анимации используйте transform и opacity, учитывайте prefers-reduced-motion.',
        ),
        '1Rs2ND1ryYc',
        14896,
        16393,
        'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout',
      ),
      lesson(
        'web5',
        bi('JavaScript, DOM & events', 'JavaScript, DOM и события'),
        bi(
          'let declares block-scoped variables; const prevents reassignment. querySelector finds an element. addEventListener attaches a handler. preventDefault cancels a default browser action. Use textContent for untrusted text instead of inserting HTML.',
          'let объявляет переменную с блочной областью, const запрещает переназначение. querySelector находит элемент, addEventListener подключает обработчик, preventDefault отменяет стандартное действие. Для непроверенного текста используйте textContent.',
        ),
        'y17RuWkWdn8',
        0,
        1117,
        'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model',
      ),
      lesson(
        'web6',
        bi('App lifecycle & browser storage', 'Жизненный цикл и хранилища'),
        bi(
          'localStorage persists string values for an origin, while sessionStorage is scoped to a tab session. A service worker can intercept requests and enable offline caching. Geolocation requires user permission and a secure context. Never store secrets in browser storage.',
          'localStorage сохраняет строки для origin, sessionStorage ограничен сессией вкладки. Service worker может перехватывать запросы и обеспечивать офлайн-кеш. Geolocation требует разрешения и безопасного контекста. Не храните секреты в браузерном хранилище.',
        ),
        '2FDpVXSBRyo',
        0,
        1186,
        'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps',
      ),
    ],
  },
  {
    id: 'devices',
    title: bi('Device Management', 'Управление устройствами'),
    category: 'Infrastructure',
    description: bi(
      'Configure, secure and troubleshoot everyday IT devices.',
      'Настраивайте, защищайте и обслуживайте устройства.',
    ),
    color: 'blue',
    symbol: 'device',
    range: '31–41',
    examCount: 36,
    objective: 'deviceconfig',
    lessons: [
      lesson(
        'dev1',
        bi('Hardware & peripherals', 'Оборудование и периферия'),
        bi(
          'CPU executes instructions, RAM holds active working data and storage retains files. SSDs have no moving parts. Match display and peripheral connectors to device capability. Power off and follow electrostatic-discharge precautions before servicing hardware.',
          'CPU выполняет инструкции, RAM хранит рабочие данные, накопитель сохраняет файлы. SSD не имеет движущихся частей. Подбирайте разъёмы по возможностям устройств. Перед обслуживанием отключайте питание и соблюдайте защиту от статического электричества.',
        ),
        'y2kg3MOk1sY',
        0,
        953,
        'https://learn.microsoft.com/en-us/windows/client-management/',
      ),
      lesson(
        'dev2',
        bi('Operating systems & setup', 'ОС и первоначальная настройка'),
        bi(
          'An operating system manages resources and provides application services. Drivers allow the OS to communicate with hardware. Keep supported systems and drivers updated. Use official driver sources and check requirements before installing software.',
          'Операционная система управляет ресурсами и поддерживает приложения. Драйвер обеспечивает взаимодействие ОС с оборудованием. Обновляйте поддерживаемую ОС и драйверы, используйте официальные источники и проверяйте требования перед установкой.',
        ),
        'MHbWOF67l3w',
        0,
        1213,
        'https://learn.microsoft.com/en-us/windows/deployment/',
      ),
      lesson(
        'dev3',
        bi('Files, storage & permissions', 'Файлы, диски и права доступа'),
        bi(
          'NTFS supports access-control lists and features unavailable in FAT32. FAT32 limits individual files to under 4 GiB. Apply least privilege to shared folders. Effective network access depends on both share and file-system permissions.',
          'NTFS поддерживает списки доступа и функции, которых нет в FAT32. В FAT32 размер одного файла меньше 4 ГиБ. Выдавайте минимальные права на общие папки. Итоговый сетевой доступ зависит и от прав общего ресурса, и от файловой системы.',
        ),
        'eisrJIF0qbY',
        0,
        1068,
        'https://learn.microsoft.com/en-us/windows-server/storage/file-server/ntfs-overview',
      ),
      lesson(
        'dev4',
        bi('Accounts & device security', 'Учётные записи и безопасность'),
        bi(
          'Use a standard user account for routine work. MFA combines independent factor types. BitLocker encrypts storage; save the recovery key safely. A screen lock protects an unattended session, while updates and endpoint protection reduce known threats.',
          'Для обычной работы используйте стандартную учётную запись. MFA сочетает независимые типы факторов. BitLocker шифрует накопитель; храните ключ восстановления безопасно. Блокировка защищает оставленный сеанс, обновления и антивирус уменьшают угрозы.',
        ),
        'Sg93dPnPP6A',
        0,
        912,
        'https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/',
      ),
      lesson(
        'dev5',
        bi('Backup & recovery', 'Резервное копирование и восстановление'),
        bi(
          'A backup is a separate recoverable copy; synchronization alone is not a backup. A full backup copies all selected data; an incremental copies changes since the last backup. Test restoration regularly. System Restore does not replace a personal-file backup.',
          'Резервная копия — отдельная восстанавливаемая копия; синхронизация не заменяет её. Полная копия содержит все выбранные данные, инкрементная — изменения с последнего копирования. Проверяйте восстановление. System Restore не заменяет копии личных файлов.',
        ),
        '-4vil3c2fa8',
        0,
        1043,
        'https://support.microsoft.com/en-us/windows/recovery-options-in-windows-31ce2444-7de3-818c-d626-e3b5a3024da5',
      ),
      lesson(
        'dev6',
        bi('Troubleshooting essentials', 'Основы диагностики'),
        bi(
          'Identify symptoms, gather evidence, form a hypothesis, test one change and document results. Task Manager shows running processes. Device Manager exposes device and driver status. Event Viewer records system events. Safe Mode loads a minimal driver set.',
          'Опишите симптомы, соберите данные, сформулируйте гипотезу, проверьте одно изменение и запишите результат. Task Manager показывает процессы, Device Manager — устройства и драйверы, Event Viewer — события. Безопасный режим загружает минимальный набор драйверов.',
        ),
        'qIenQsBAg2U',
        0,
        1050,
        'https://learn.microsoft.com/en-us/troubleshoot/windows-client/',
      ),
    ],
  },
]
export const examSource =
  'https://certiport.pearsonvue.com/Educator-resources/Exam-details/Exam-lengths'
export const objectiveSource =
  'https://certiport.pearsonvue.com/Certifications/ITSpecialist/Certification/Certify'

// Public embed metadata verified from publisher pages and YouTube oEmbed, 2026-10-25.
export const videoSources: Record<
  string,
  { author: string; title: string; duration: number }
> = {
  rfscVS0vtbw: {
    author: 'freeCodeCamp.org / Mike Dane',
    title: 'Learn Python — Full Course for Beginners',
    duration: 16012,
  },
  HXV3zeQKqGY: {
    author: 'freeCodeCamp.org / Mike Dane',
    title: 'SQL Tutorial — Full Database Course for Beginners',
    duration: 15639,
  },
  qiQR5rTSshw: {
    author: 'freeCodeCamp.org / Brian Ferrill',
    title: 'Computer Networking Course — Network Engineering',
    duration: 33735,
  },
  'pQN-pnXPaVg': {
    author: 'freeCodeCamp.org / Mike Dane',
    title: 'HTML Full Course — Build a Website',
    duration: 7352,
  },
  '1Rs2ND1ryYc': {
    author: 'freeCodeCamp.org',
    title: 'CSS Tutorial — Zero to Hero',
    duration: 22717,
  },
  y2kg3MOk1sY: {
    author: 'freeCodeCamp.org / GCFGlobal',
    title: 'Computer & Technology Basics',
    duration: 3304,
  },
  MHbWOF67l3w: {
    author: 'Passionate About Tech',
    title: 'Windows 11 Tutorial for Beginners',
    duration: 1213,
  },
  eisrJIF0qbY: {
    author: 'David Dalton',
    title: 'Configuring NTFS Permissions',
    duration: 1068,
  },
  Sg93dPnPP6A: {
    author: 'Jonathan Edwards',
    title: 'Introducing BitLocker',
    duration: 912,
  },
  '-4vil3c2fa8': {
    author: 'Britec09',
    title: 'All You Need To Know About Windows 11 Backup',
    duration: 1043,
  },
  qIenQsBAg2U: {
    author: 'Professor Messer',
    title: 'Troubleshooting Windows — CompTIA A+ 220-1202',
    duration: 1050,
  },
  y17RuWkWdn8: {
    author: 'Web Dev Simplified',
    title: 'Learn DOM Manipulation In 18 Minutes',
    duration: 1117,
  },
  '2FDpVXSBRyo': {
    author: 'Steve Griffith',
    title: 'Service Workers — The Storage API',
    duration: 1186,
  },
}
