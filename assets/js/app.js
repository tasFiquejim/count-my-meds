let medicines = JSON.parse(localStorage.getItem('medicines')) || [];

const form = document.getElementById('medicineForm');
const list = document.getElementById('medicineList');
const nameInput = document.getElementById('medicineName');
const qtyInput  = document.getElementById('medicineQty');

function save() {
  localStorage.setItem('medicines', JSON.stringify(medicines));
}

function renderList() {
  list.innerHTML = '';

  medicines.forEach((med, index) => {
    const li = document.createElement('li');
    li.textContent = `${med.name} - ${med.qty}`;

    if (med.qty < 5) li.classList.add('low-stock');

    const takeBtn = document.createElement('button');
    takeBtn.textContent = 'Take Dose';
    takeBtn.addEventListener('click', () => {
      if (med.qty > 0) {
        med.qty -= 1;
        if (med.qty === 0) alert(`${med.name} is out of stock!`);
        save();
        renderList();
      }
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const newName = prompt('Edit name:', med.name);
      if (newName === null) return;

      const newQtyStr = prompt('Edit quantity:', med.qty);
      if (newQtyStr === null) return;

      const newQty = parseInt(newQtyStr, 10);
      if (!Number.isFinite(newQty) || newQty < 0) {
        alert('Quantity must be a non-negative number.');
        return;
      }

      med.name = newName.trim() || med.name;
      med.qty = newQty;
      save();
      renderList();
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      medicines.splice(index, 1);
      save();
      renderList();
    });

    li.appendChild(takeBtn);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  if (medicines.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No medicines yet. Add one above.';
    list.appendChild(empty);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const qty = parseInt(qtyInput.value, 10);

  if (!name) return alert('Medicine name is required.');
  if (!Number.isFinite(qty) || qty < 0) return alert('Quantity must be a non-negative number.');

  const existing = medicines.find(med => med.name.toLowerCase() === name.toLowerCase());

  if (existing) {
    existing.qty += qty; 
  } else {
    medicines.push({ name, qty });
  }

  save();
  form.reset();
  nameInput.focus();
  renderList();
});

renderList();
