const rows=[
['Наименование товара','Насос центробежный','Насос центробежный','Совпадение','Низкий','Наименование идентично','match','all'],
['Производительность','250 м³/ч','280 м³/ч','Изменено','Средний','Увеличение на 12%. Проверить обоснование потребности.','edit','changed'],
['Напор','45 м','45 м','Совпадение','Низкий','Значение не изменялось','match','all'],
['Материал корпуса','Чугун СЧ20','Нержавеющая сталь AISI 304','Изменено','Средний','Изменён материал; оцените влияние на стоимость.','edit','changed'],
['Производитель','Не указан','Grundfos CR 64-2','Добавлено','Высокий','Указание бренда может ограничивать конкуренцию.','danger','warning'],
['Сертификаты','СТ РК, ISO 9001','СТ РК, ISO 9001, API 610','Добавлено','Средний','Дополнительный сертификат требует обоснования.','edit','changed'],
['Гарантия','24 месяца','36 месяцев','Изменено','Низкий','Условия улучшены','edit','changed'],
['Срок поставки','60 календарных дней','60 календарных дней','Совпадение','Низкий','Значение не изменялось','match','all'],
['Опыт поставщика','Не менее 3 лет','Не менее 10 лет','Изменено','Высокий','Требование может быть чрезмерным.','danger','warning']
];
const findings=[
['high','Указание конкретного производителя','Обнаружено требование: «Grundfos CR 64-2». В спецификации отсутствует формулировка «или эквивалент».','Используйте измеримые характеристики и добавьте «или эквивалент».','Высокий'],
['','Повышенное требование к опыту','Требование опыта поставки насосного оборудования не менее 10 лет может сузить круг участников.','Определите минимальный опыт, прямо связанный с предметом закупки.','Средний'],
['','Дополнительный сертификат API 610','Сертификат добавлен без указания обоснования применимости к объекту закупки.','Зафиксируйте техническое обоснование или сформулируйте альтернативное подтверждение.','Средний']
];
const tbody=document.querySelector('#comparisonRows');
function renderRows(filter='all',query=''){tbody.innerHTML='';rows.filter(r=>(filter==='all'||r[7]===filter)&&(r.join(' ').toLowerCase().includes(query.toLowerCase()))).forEach(r=>{tbody.insertAdjacentHTML('beforeend',`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td><span class="badge ${r[6]}">${r[3]}</span></td><td>${r[4]}</td><td>${r[5]}</td></tr>`)});}
function renderFindings(){document.querySelector('#findingCards').innerHTML=findings.map((f,i)=>`<article class="finding ${f[0]}"><div><span class="badge ${f[0]?'danger':'edit'}">${f[4]} риск</span><h3>${f[1]}</h3><p>${f[2]}</p><p class="recommendation">Рекомендация: ${f[3]}</p></div><select class="decision" data-i="${i}"><option>Требует доработки</option><option>Принято</option><option>Отклонено</option></select></article>`).join('');document.querySelectorAll('.decision').forEach(s=>s.addEventListener('change',()=>toast('Экспертное решение сохранено')))}
function toast(t){const e=document.querySelector('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2300)}
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');toast('Выбран режим: '+b.innerText.split('\n')[0])});
document.querySelectorAll('.dropzone input').forEach(i=>i.onchange=()=>{if(i.files[0]){i.parentElement.querySelector('output').textContent=i.files[0].name;toast('Файл добавлен к проверке')}});
document.querySelector('#runCheck').onclick=()=>{document.querySelector('#results').classList.remove('hidden');document.querySelector('#results').scrollIntoView({behavior:'smooth',block:'start'});toast('Проверка завершена: найдено 3 замечания')};
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderRows(b.dataset.filter,document.querySelector('#search').value)});
document.querySelector('#search').oninput=e=>renderRows(document.querySelector('.filter.active').dataset.filter,e.target.value);
document.querySelector('#exportCsv').onclick=()=>{const csv=['Параметр;ТС 1;ТС 2;Результат;Риск;Комментарий',...rows.map(r=>r.slice(0,6).map(x=>'"'+x+'"').join(';'))].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='отчет_сравнения_ТС.csv';a.click();toast('Отчёт CSV сформирован')};
document.querySelector('#printReport').onclick=()=>window.print();
document.querySelector('#addFile').onclick=()=>toast('В MVP поддержка третьего документа отображается после загрузки файла');
renderRows();renderFindings();
