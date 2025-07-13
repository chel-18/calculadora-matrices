// Mostrar secciones

function showSection(id) {
document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
document.getElementById(id).classList.add('active');
// Renderizar matrices y sistema si corresponde

if (id === 'matrices') {
renderMatrix('A');
renderMatrix('B');
}
if (id === 'sistemas') {
renderSystem();
}
if (id === 'determinantes') {
renderDet();
}
}

// ========================== MATRICES ===============================

let matrixSize = { A: 3, B: 3 };
function renderMatrix(matrixId) {
const size = matrixSize[matrixId];
let html = '<table class="gauss-matrix">';
for (let i = 0; i < size; i++) {
  html += '<tr>';
  for (let j = 0; j < size; j++) {
    html += `<td><input type="number" id="${matrixId}-${i}-${j}" /></td>`;
  }
  html += '</tr>';
}
html += '</table>';
document.getElementById('matrix' + matrixId).innerHTML = html;
}

function increaseMatrix(matrixId) {
if (matrixSize[matrixId] < 6) {
matrixSize[matrixId]++;
renderMatrix(matrixId);
}
}

function decreaseMatrix(matrixId) {
if (matrixSize[matrixId] > 2) {
matrixSize[matrixId]--;
renderMatrix(matrixId);
}
}

function clearMatrix() {
document.querySelectorAll('#matrixA input, #matrixB input').forEach(input => input.value = '');
document.getElementById('matrix-result').innerHTML = '';
document.getElementById('resultA').innerHTML = '';
document.getElementById('resultB').innerHTML = '';
}

function getMatrix(matrixId) {
const size = matrixSize[matrixId];
let M = [];
for (let i = 0; i < size; i++) {
let row = [];
for (let j = 0; j < size; j++) {
  const val = parseFloat(document.getElementById(`${matrixId}-${i}-${j}`).value) || 0;
  row.push(val);
}
M.push(row);
}
return M;
}

function operateMatrices(op) {
const A = getMatrix('A');
const B = getMatrix('B');
const size = matrixSize['A'];
if (matrixSize['A'] !== matrixSize['B']) {
document.getElementById('matrix-result').innerHTML = '<span class="error">Las matrices deben tener el mismo tamaño</span>';
return;
}

let result = [];
if (op === 'sum' || op === 'sub') {
for (let i = 0; i < size; i++) {
  let row = [];
  for (let j = 0; j < size; j++) {
    row.push(op === 'sum' ? A[i][j] + B[i][j] : A[i][j] - B[i][j]);
  }
  result.push(row);
}
} else if (op === 'mul') {
for (let i = 0; i < size; i++) {
  let row = [];
  for (let j = 0; j < size; j++) {
    let sum = 0;
    for (let k = 0; k < size; k++) {
      sum += A[i][k] * B[k][j];

    }
    row.push(sum);
  }
  result.push(row);
}
}
document.getElementById('matrix-result').innerHTML = matrixToTable(result);
}
function matrixToTable(mat) {
let html = '<table class="gauss-matrix">';
for (let i = 0; i < mat.length; i++) {
  html += '<tr>';
  for (let j = 0; j < mat[i].length; j++) {
    html += `<td>${mat[i][j].toFixed ? mat[i][j].toFixed(2) : mat[i][j]}</td>`;
  }
  html += '</tr>';
}
html += '</table>';
return html;
}
function displayResult(id, text, mat = null) {
const el = document.getElementById('result' + id);
if (mat) {
el.innerHTML = `${text}<br>${matrixToTable(mat)}`;
} else {
el.innerHTML = text;
}
}
function matrixDet(id) {
const mat = getMatrix(id);
const det = determinant(mat);
displayResult(id, `Determinante: ${det.toFixed(2)}`);
}
function matrixTrans(id) {
const mat = getMatrix(id);
const trans = mat[0].map((_, i) => mat.map(row => row[i]));
displayResult(id, 'Transpuesta:', trans);
}
function matrixInverse(id) {
const mat = getMatrix(id);
const inv = inverse(mat);
if (!inv) {
displayResult(id, 'No tiene inversa');
} else {
displayResult(id, 'Inversa:', inv);
}
}

function matrixEscalar(id, escalar) {
const mat = getMatrix(id);
const res = mat.map(row => row.map(val => val * escalar));
displayResult(id, `Multiplicada por ${escalar}:`, res);
}

function matrixDiagonal(id) {
const mat = getMatrix(id);
const diag = mat.map((row, i) => row.map((val, j) => (i === j ? val : 0)));
displayResult(id, 'Diagonal:', diag);
}
function matrixTriangular(id) {
const mat = getMatrix(id);
const upper = mat.map((row, i) => row.map((val, j) => (j >= i ? val : 0)));
displayResult(id, 'Triangular superior:', upper);
}
function matrixRango(id) {
const mat = getMatrix(id);
const rango = rank(mat);
displayResult(id, `Rango: ${rango}`);
}
function matrixPotencia(id, exp) {
let mat = getMatrix(id);
let res = identityMatrix(mat.length);
for (let i = 0; i < exp; i++) {
res = multiplyMatrices(res, mat);
}
displayResult(id, `Matriz elevada a ${exp}:`, res);
}
// ========================== FUNCIONES AUXILIARES ===============================
// Determinante (recursivo)
// Convertir decimal a fracción (máximo denominador 1000)
function decimalToFraction(value, maxDen = 1000) {
  if (Number.isInteger(value)) return value.toString();
  let sign = value < 0 ? '-' : '';
  value = Math.abs(value);
  let bestNum = 1, bestDen = 1, bestError = Math.abs(value - 1);
  for (let den = 1; den <= maxDen; den++) {
    let num = Math.round(value * den);
    let error = Math.abs(value - num / den);
    if (error < bestError) {
      bestNum = num;
      bestDen = den;
      bestError = error;
      if (error < 1e-8) break;
    }
  }
  return sign + bestNum + '/' + bestDen;
}

// Mostrar matriz como tabla de fracciones
function matrixToFractionTable(mat) {
  let html = '<table>';
  for (let i = 0; i < mat.length; i++) {
    html += '<tr>';
    for (let j = 0; j < mat[i].length; j++) {
      html += `<td>${decimalToFraction(mat[i][j])}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  return html;
}
function determinant(m) {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0]*m[1][1] - m[0][1]*m[1][0];
  let det = 0;
  for (let i = 0; i < n; i++) {
    let sub = m.slice(1).map(row => row.filter((_, j) => j !== i));
    det += ((i % 2 === 0 ? 1 : -1) * m[0][i] * determinant(sub));
  }
  return det;
}

// Inversa (por Gauss-Jordan)
function inverse(m) {
  const n = m.length;
  let A = m.map(row => row.slice());
  let I = identityMatrix(n);
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i+1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
    }
    if (A[maxRow][i] === 0) return null;
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [I[i], I[maxRow]] = [I[maxRow], I[i]];
    let piv = A[i][i];
    for (let j = 0; j < n; j++) {
      A[i][j] /= piv;
      I[i][j] /= piv;
    }
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        let f = A[k][i];
        for (let j = 0; j < n; j++) {
          A[k][j] -= f * A[i][j];
          I[k][j] -= f * I[i][j];
        }
      }
    }
  }
  return I;
}

function identityMatrix(n) {
  let I = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) row.push(i === j ? 1 : 0);
    I.push(row);
  }
  return I;
}

function multiplyMatrices(A, B) {
  let n = A.length;
  let result = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) sum += A[i][k] * B[k][j];
      row.push(sum);
    }
    result.push(row);
  }
  return result;
}

// Rango (por eliminación de Gauss)
function rank(m) {
  let M = m.map(row => row.slice());
  let n = M.length, mcols = M[0].length, r = 0;
  for (let i = 0; i < n; i++) {
    let found = false;
    for (let j = r; j < mcols; j++) {
      for (let k = i; k < n; k++) {
        if (Math.abs(M[k][j]) > 1e-10) {
          [M[i], M[k]] = [M[k], M[i]];
          found = true;
          break;
        }
      }
      if (found) {
        let piv = M[i][j];
        for (let l = j; l < mcols; l++) M[i][l] /= piv;
        for (let k = 0; k < n; k++) {
          if (k !== i) {
            let f = M[k][j];
            for (let l = j; l < mcols; l++) M[k][l] -= f * M[i][l];
          }
        }
        r++;
        break;
      }
    }
  }
  return r;
}

// ========================== SISTEMAS ===============================

let systemSize = 3;
function renderSystem() {
let html = '<table class="gauss-matrix">';
for (let i = 0; i < systemSize; i++) {
  html += '<tr>';
  for (let j = 0; j < systemSize; j++) {
    html += `<td><input type="number" id="s-${i}-${j}" placeholder="x${j+1}" /></td>`;
    if (j < systemSize - 1) html += `<td> + </td>`;
  }
  html += `<td> = </td><td><input type="number" id="s-${i}-b" placeholder="b${i+1}" /></td>`;
  html += '</tr>';
}
html += '</table>';
document.getElementById('system-container').innerHTML = html;
}
// ========================== Rouche-Frobenius ===============================
function applyRoucheFrobenius() {
  let n = systemSize;
  let A = [], B = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      let val = parseFloat(document.getElementById(`s-${i}-${j}`).value) || 0;
      row.push(val);
    }
    A.push(row);
    B.push([parseFloat(document.getElementById(`s-${i}-b`).value) || 0]);
  }
  // Matriz aumentada
  let aug = A.map((row, i) => row.concat(B[i]));
  let rA = rank(A);
  let rAug = rank(aug);
  let html = `<div class='gauss-method-box'><div class='gauss-method-title'>Rouché-Frobenius</div><div class='gauss-method-content'>`;
  html += `<b>Matriz de coeficientes (A):</b><br>` + matrixToFractionTable(A) + '<br>';
  html += `<b>Matriz aumentada (A|B):</b><br>` + matrixToFractionTable(aug) + '<br>';
  html += `<b>Rango de A:</b> ${rA}<br>`;
  html += `<b>Rango de A|B:</b> ${rAug}<br>`;
  html += `<b>Número de incógnitas (n):</b> ${n}<br><br>`;
  if (rA === rAug && rA === n) {
    html += `<span class='rouche-resultado' style='color:green;'><b>El sistema tiene solución única.</b></span>`;
  } else if (rA === rAug && rA < n) {
    html += `<span class='rouche-resultado' style='color:orange;'><b>El sistema tiene infinitas soluciones.</b></span>`;
  } else {
    html += `<span class='rouche-resultado' style='color:red;'><b>El sistema no tiene solución.</b></span>`;
  }
  html += '</div></div>';
  let methodDiv = document.getElementById('method-process');
  methodDiv.innerHTML += html;
}
function increaseSystem() {
if (systemSize < 6) {
systemSize++;
renderSystem();
}
}
function decreaseSystem() {
if (systemSize > 2) {
systemSize--;
renderSystem();
}
}
function clearSystem() {
document.querySelectorAll('#system-container input').forEach(input => input.value = '');
document.getElementById('system-result').innerHTML = '';
}
function solveSystem() {
let A = [], B = [];
for (let i = 0; i < systemSize; i++) {
let row = [];
for (let j = 0; j < systemSize; j++) {
  let val = parseFloat(document.getElementById(`s-${i}-${j}`).value) || 0;
  row.push(val);
}
A.push(row);
B.push([parseFloat(document.getElementById(`s-${i}-b`).value) || 0]);
}
for (let i = 0; i < systemSize; i++) {
let pivot = A[i][i];
if (pivot === 0) {
  document.getElementById('system-result').innerText = "Error: pivote cero.";
  return;
}
for (let j = 0; j < systemSize; j++) A[i][j] /= pivot;
B[i][0] /= pivot;
for (let k = 0; k < systemSize; k++) {
  if (k !== i) {
    let factor = A[k][i];
    for (let j = 0; j < systemSize; j++) A[k][j] -= factor * A[i][j];
    B[k][0] -= factor * B[i][0];
  }
}
}
let result = "";
for (let i = 0; i < systemSize; i++) {
result += `x${i + 1} = ${B[i][0].toFixed(2)}<br>`;
}
document.getElementById('system-result').innerHTML = result;
}

// ========================== Gauss-Jordan con proceso ===============================
function applyGaussJordan() {
  let A = [], B = [];
  for (let i = 0; i < systemSize; i++) {
    let row = [];
    for (let j = 0; j < systemSize; j++) {
      let val = parseFloat(document.getElementById(`s-${i}-${j}`).value) || 0;
      row.push(val);
    }
    A.push(row);
    B.push([parseFloat(document.getElementById(`s-${i}-b`).value) || 0]);
  }
  // Matriz aumentada
  let aug = A.map((row, i) => row.concat(B[i]));
  let process = `<b>Proceso Gauss-Jordan:</b><br><br>`;
  function augToHTML(mat, pivI = -1, pivJ = -1) {
    let html = '<table class="gauss-matrix">';
    for (let i = 0; i < mat.length; i++) {
      html += '<tr>';
      for (let j = 0; j < mat[i].length; j++) {
        let cellClass = (i === pivI && j === pivJ) ? ' class="pivote"' : '';
        // Separador visual para la columna de resultados
        if (j === mat[i].length - 1) {
          html += `<td${cellClass} style="border-left:2px solid #fff; font-weight:bold; background:#2e2b4a;">${mat[i][j].toFixed(2)}</td>`;
        } else {
          html += `<td${cellClass}>${mat[i][j].toFixed(2)}</td>`;
        }
      }
      html += '</tr>';
    }
    html += '</table>';
    return html;
  }
  process += '<div class="gauss-step"><span class="gauss-op">Matriz aumentada inicial</span><br>' + augToHTML(aug) + '</div>';
  // Gauss-Jordan
  for (let i = 0; i < systemSize; i++) {
    // Buscar el máximo en la columna i
    let maxRow = i;
    for (let k = i + 1; k < systemSize; k++) {
      if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) maxRow = k;
    }
    if (aug[maxRow][i] === 0) {
      document.getElementById('method-process').innerHTML = '<span class="error">No se puede resolver: pivote cero.</span>';
      return;
    }
    if (maxRow !== i) {
      [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];
      process += `<div class='gauss-step'><span class='gauss-op'>Intercambio: F<sub>${i+1}</sub> =1C F<sub>${maxRow+1}</sub></span><br>` + augToHTML(aug, i, i) + '</div>';
    }
    // Multiplicar fila i por 1/pivote
    let piv = aug[i][i];
    if (piv !== 1) {
      for (let j = 0; j < aug[i].length; j++) aug[i][j] /= piv;
      process += `<div class='gauss-step'><span class='gauss-op'>F<sub>${i+1}</sub> = F<sub>${i+1}</sub> / ${piv.toFixed(2)}</span><br>` + augToHTML(aug, i, i) + '</div>';
    } else {
      // Resalta pivote aunque no se divida
      process += `<div class='gauss-step'><span class='gauss-op'>Pivote en F<sub>${i+1}</sub>, columna ${i+1}</span><br>` + augToHTML(aug, i, i) + '</div>';
    }
    // Eliminar en otras filas
    for (let k = 0; k < systemSize; k++) {
      if (k !== i) {
        let factor = aug[k][i];
        if (factor !== 0) {
          for (let j = 0; j < aug[k].length; j++) aug[k][j] -= factor * aug[i][j];
          let op = `F<sub>${k+1}</sub> = F<sub>${k+1}</sub> - (${factor.toFixed(4)})F<sub>${i+1}</sub>`;
          process += `<div class='gauss-step'><span class='gauss-op'>${op}</span><br>` + augToHTML(aug, k, i) + '</div>';
        }
      }
    }
  }
  // Solución
  let result = '<div class="gauss-sol"><b>Solución:</b><br>';
  for (let i = 0; i < systemSize; i++) {
    result += `x<sub>${i+1}</sub> = ${aug[i][systemSize].toFixed(2)}<br>`;
  }
  result += '</div>';
  process += result;
  document.getElementById('method-process').innerHTML = process;
}

//==================== Metodo Inversa de matriz============================

function applyMatrixInverse() {
  let n = systemSize;
  let A = [], B = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      let val = parseFloat(document.getElementById(`s-${i}-${j}`).value) || 0;
      row.push(val);
    }
    A.push(row);
    B.push([parseFloat(document.getElementById(`s-${i}-b`).value) || 0]);
  }

  // Clasificación y presentación de datos
  let html = `<b>Método de la Inversa de la Matriz</b><br><br>`;
  html += `<b>Tamaño de la matriz:</b> ${n}x${n}<br>`;
  html += `<b>Coeficientes (A):</b><br>` + matrixToTable(A) + '<br>';
  html += `<b>Términos independientes (B):</b><br>` + matrixToTable(B) + '<br>';

  // Proceso para hallar la inversa
  html += `<b>Proceso para hallar la inversa de A:</b><br>`;
  // Matriz aumentada [A | I]
  let AI = A.map((row, i) => row.concat(identityMatrix(n)[i]));
  function augToHTML(mat, pivI = -1, pivJ = -1) {
    let html = '<table class="gauss-matrix">';
    for (let i = 0; i < mat.length; i++) {
      html += '<tr>';
      for (let j = 0; j < mat[i].length; j++) {
        let cellClass = (i === pivI && j === pivJ) ? ' class="pivote"' : '';
        if (j === n-1) html += `<td${cellClass} style="border-right:2px solid #fff;">${mat[i][j].toFixed(2)}</td>`;
        else html += `<td${cellClass}>${mat[i][j].toFixed(2)}</td>`;
      }
      html += '</tr>';
    }
    html += '</table>';
    return html;
  }
  html += '<div class="gauss-step"><span class="gauss-op">Matriz aumentada [A | I]</span><br>' + augToHTML(AI) + '</div>';

  // Gauss-Jordan para inversa
  for (let i = 0; i < n; i++) {
    // Buscar el máximo en la columna i
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(AI[k][i]) > Math.abs(AI[maxRow][i])) maxRow = k;
    }
    if (AI[maxRow][i] === 0) {
      document.getElementById('method-process').innerHTML += '<span class="error">No se puede invertir: pivote cero.</span>';
      return;
    }
    if (maxRow !== i) {
      [AI[i], AI[maxRow]] = [AI[maxRow], AI[i]];
      html += `<div class='gauss-step'><span class='gauss-op'>Intercambio: F<sub>${i+1}</sub> = F<sub>${maxRow+1}</sub></span><br>` + augToHTML(AI, i, i) + '</div>';
    }
    // Multiplicar fila i por 1/pivote
    let piv = AI[i][i];
    if (piv !== 1) {
      for (let j = 0; j < AI[i].length; j++) AI[i][j] /= piv;
      html += `<div class='gauss-step'><span class='gauss-op'>F<sub>${i+1}</sub> = F<sub>${i+1}</sub> / ${piv.toFixed(2)}</span><br>` + augToHTML(AI, i, i) + '</div>';
    } else {
      html += `<div class='gauss-step'><span class='gauss-op'>Pivote en F<sub>${i+1}</sub>, columna ${i+1}</span><br>` + augToHTML(AI, i, i) + '</div>';
    }
    // Eliminar en otras filas
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        let factor = AI[k][i];
        if (factor !== 0) {
          for (let j = 0; j < AI[k].length; j++) AI[k][j] -= factor * AI[i][j];
          let op = `F<sub>${k+1}</sub> = F<sub>${k+1}</sub> - (${factor.toFixed(4)})F<sub>${i+1}</sub>`;
          html += `<div class='gauss-step'><span class='gauss-op'>${op}</span><br>` + augToHTML(AI, k, i) + '</div>';
        }
      }
    }
  }
  // Extraer inversa
  let Ainv = AI.map(row => row.slice(n));
  html += `<b>Matriz inversa A<sup>-1</sup>:</b><br>` + matrixToTable(Ainv) + '<br>';

  // Calcular X = A^-1 * B
  let X = [];
  let multProcess = '<b>Multiplicación X = A<sup>-1</sup>B:</b><br>';
  for (let i = 0; i < n; i++) {
    let sum = 0;
    let rowOps = [];
    for (let j = 0; j < n; j++) {
      sum += Ainv[i][j] * B[j][0];
      rowOps.push(`(${Ainv[i][j].toFixed(2)}×${B[j][0].toFixed(2)})`);
    }
    X.push(sum);
    multProcess += `x<sub>${i+1}</sub> = ` + rowOps.join(' + ') + ` = <b>${sum.toFixed(4)}</b><br>`;
  }
  html += multProcess;
  html += `<b>Solución final:</b><br>`;
  for (let i = 0; i < n; i++) {
    html += `x<sub>${i+1}</sub> = ${X[i].toFixed(4)}<br>`;
  }

  // Mostrar resultado debajo del proceso de Gauss-Jordan (si existe)
  let methodDiv = document.getElementById('method-process');
  if (methodDiv.innerHTML.trim() !== '') {
    methodDiv.innerHTML += '<hr style="margin:1.5em 0;">' + html;
  } else {
    methodDiv.innerHTML = html;
  }
}
//==================== Metodo Regla de Cramer============================

function applyCramerRule() {
  let n = systemSize;
  let A = [], B = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      let val = parseFloat(document.getElementById(`s-${i}-${j}`).value) || 0;
      row.push(val);
    }
    A.push(row);
    B.push(parseFloat(document.getElementById(`s-${i}-b`).value) || 0);
  }

  let html = `<b>Regla de Cramer</b><br><br>`;
  html += `<b>Coeficientes (A):</b><br>` + matrixToTable(A) + '<br>';
  html += `<b>Términos independientes (B):</b><br>` + matrixToTable(B.map(x => [x])) + '<br>';

  // Determinante principal
  let D = determinant(A);
  html += `<b>Determinante principal (D):</b><br>` + matrixToTable(A) + `<br>D = <b>${D.toFixed(4)}</b><br><br>`;

  if (Math.abs(D) < 1e-10) {
    html += '<span class="error">El sistema no tiene solución única (D = 0).</span>';
    document.getElementById('method-process').innerHTML += html;
    return;
  }

  // Determinantes Dx1, Dx2, ...
  let results = [];
  for (let v = 0; v < n; v++) {
    // Construir matriz para Dx_v
    let matDx = A.map((row, i) => row.map((val, j) => (j === v ? B[i] : val)));
    let Dx = determinant(matDx);
    html += `<b>Determinante D<sub>x${v+1}</sub>:</b><br>` + matrixToTable(matDx) + `<br>D<sub>x${v+1}</sub> = <b>${Dx.toFixed(4)}</b><br>`;
    results.push(Dx);
  }

  // Soluciones
  html += `<b>Soluciones:</b><br>`;
  for (let v = 0; v < n; v++) {
    html += `x<sub>${v+1}</sub> = D<sub>x${v+1}</sub> / D = (${results[v].toFixed(4)}) / (${D.toFixed(4)}) = <b>${(results[v]/D).toFixed(4)}</b><br>`;
  }

  // Mostrar resultado debajo del proceso anterior (si existe)
  let methodDiv = document.getElementById('method-process');
  if (methodDiv.innerHTML.trim() !== '') {
    methodDiv.innerHTML += '<hr style="margin:1.5em 0;">' + html;
  } else {
    methodDiv.innerHTML = html;
  }
}


// ========================== DETERMINANTES ===============================

let detSize = 3;
function renderDet() {
let html = '<table class="gauss-matrix">';
for (let i = 0; i < detSize; i++) {
  html += '<tr>';
  for (let j = 0; j < detSize; j++) {
    html += `<td><input type="number" id="det-${i}-${j}" /></td>`;
  }
  html += '</tr>';
}
html += '</table>';
document.getElementById('det-matrix').innerHTML = html;
}
function increaseDet() {
if (detSize < 6) {
detSize++;
renderDet();
}
}
function decreaseDet() {
if (detSize > 2) {
detSize--;
renderDet();
}
}
function clearDet() {
document.querySelectorAll('#det-matrix input').forEach(input => input.value = '');
document.getElementById('det-result').innerHTML = '';
}
function calculateDet() {
let M = [];
for (let i = 0; i < detSize; i++) {
let row = [];
for (let j = 0; j < detSize; j++) {
row.push(parseFloat(document.getElementById(`det-${i}-${j}`).value) || 0);
}
M.push(row);
}
const det = determinant(M);
document.getElementById('det-result').innerHTML = `Determinante: ${det.toFixed(2)}`;
}

// ========================== Sarrus (solo 3x3) ===============================
function detSarrus() {
  if (detSize !== 3) {
    document.getElementById('det-result').innerHTML = '<span class="error">Sarrus solo aplica a matrices 3x3.</span>';
    return;
  }
  let M = [];
  for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
      row.push(parseFloat(document.getElementById(`det-${i}-${j}`).value) || 0);
    }
    M.push(row);
  }
  let pos = M[0][0]*M[1][1]*M[2][2] + M[0][1]*M[1][2]*M[2][0] + M[0][2]*M[1][0]*M[2][1];
  let neg = M[0][2]*M[1][1]*M[2][0] + M[0][0]*M[1][2]*M[2][1] + M[0][1]*M[1][0]*M[2][2];
  let det = pos - neg;
  let html = `<b>Método de Sarrus (3x3):</b><br><br>`;
  html += matrixToFractionTable(M) + '<br>';
  html += `<b>Positivos:</b> (${decimalToFraction(M[0][0])}×${decimalToFraction(M[1][1])}×${decimalToFraction(M[2][2])}) + (`;
  html += `${decimalToFraction(M[0][1])}×${decimalToFraction(M[1][2])}×${decimalToFraction(M[2][0])}) + (`;
  html += `${decimalToFraction(M[0][2])}×${decimalToFraction(M[1][0])}×${decimalToFraction(M[2][1])})<br>`;
  html += `<b>Negativos:</b> (${decimalToFraction(M[0][2])}×${decimalToFraction(M[1][1])}×${decimalToFraction(M[2][0])}) + (`;
  html += `${decimalToFraction(M[0][0])}×${decimalToFraction(M[1][2])}×${decimalToFraction(M[2][1])}) + (`;
  html += `${decimalToFraction(M[0][1])}×${decimalToFraction(M[1][0])}×${decimalToFraction(M[2][2])})<br>`;
  html += `<b>Determinante:</b> ${decimalToFraction(pos)} - ${decimalToFraction(neg)} = <b>${decimalToFraction(det)}</b>`;
  document.getElementById('det-result').innerHTML = html;
}

// ========================== Gauss (eliminación) ===============================
function detGauss() {
  let M = [];
  for (let i = 0; i < detSize; i++) {
    let row = [];
    for (let j = 0; j < detSize; j++) {
      row.push(parseFloat(document.getElementById(`det-${i}-${j}`).value) || 0);
    }
    M.push(row);
  }
  let n = M.length;
  let mat = M.map(row => row.slice());
  let det = 1;
  let swaps = 0;
  let html = `<b>Método de Gauss:</b><br><br>` + matrixToFractionTable(mat) + '<br>';
  for (let i = 0; i < n; i++) {
    // Buscar pivote
    let maxRow = i;
    for (let k = i+1; k < n; k++) {
      if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) maxRow = k;
    }
    if (mat[maxRow][i] === 0) {
      html += '<span class="error">Determinante: 0 (fila nula).</span>';
      document.getElementById('det-result').innerHTML = html;
      return;
    }
    if (maxRow !== i) {
      [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
      swaps++;
      html += `Intercambio de filas ${i+1} y ${maxRow+1}<br>` + matrixToFractionTable(mat) + '<br>';
    }
    let piv = mat[i][i];
    det *= piv;
    for (let k = i+1; k < n; k++) {
      let factor = mat[k][i]/piv;
      for (let j = i; j < n; j++) {
        mat[k][j] -= factor * mat[i][j];
      }
      html += `F<sub>${k+1}</sub> = F<sub>${k+1}</sub> - (${decimalToFraction(factor)})F<sub>${i+1}</sub><br>` + matrixToFractionTable(mat) + '<br>';
    }
  }
  det *= (swaps % 2 === 0 ? 1 : -1);
  html += `<b>Determinante:</b> <b>${decimalToFraction(det)}</b> (ajustado por ${swaps} intercambio${swaps === 1 ? '' : 's'})`;
  document.getElementById('det-result').innerHTML = html;
}

// ========================== Leibniz (todas permutaciones) ===============================
function detLeibniz() {
  let M = [];
  for (let i = 0; i < detSize; i++) {
    let row = [];
    for (let j = 0; j < detSize; j++) {
      row.push(parseFloat(document.getElementById(`det-${i}-${j}`).value) || 0);
    }
    M.push(row);
  }
  let n = M.length;
  function permute(arr) {
    if (arr.length <= 1) return [arr];
    let out = [];
    for (let i = 0; i < arr.length; i++) {
      let rest = arr.slice(0,i).concat(arr.slice(i+1));
      for (let p of permute(rest)) out.push([arr[i]].concat(p));
    }
    return out;
  }
  function parity(p) {
    let inv = 0;
    for (let i = 0; i < p.length; i++) {
      for (let j = i+1; j < p.length; j++) {
        if (p[i] > p[j]) inv++;
      }
    }
    return inv % 2 === 0 ? 1 : -1;
  }
  let perms = permute([...Array(n).keys()]);
  let det = 0;
  let html = `<b>Método de Leibniz:</b><br><br>` + matrixToFractionTable(M) + '<br>';
  html += `<b>Permutaciones:</b><br>`;
  for (let p of perms) {
    let prod = 1;
    let term = '';
    for (let i = 0; i < n; i++) {
      prod *= M[i][p[i]];
      term += (i > 0 ? '×' : '') + decimalToFraction(M[i][p[i]]);
    }
    let sign = parity(p);
    det += sign * prod;
    html += `${sign === 1 ? '+' : '-'} (${term})<br>`;
  }
  html += `<b>Determinante:</b> <b>${decimalToFraction(det)}</b>`;
  document.getElementById('det-result').innerHTML = html;
}
// ========================== INICIO ===============================
renderMatrix('A');
renderMatrix('B');
renderSystem();
renderDet();