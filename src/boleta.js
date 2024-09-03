function calculateTotal() {
    var table = document.getElementById('productTable');
    var rows = table.getElementsByTagName('tr');
    var grandTotal = 0;
    for (var i = 0; i < rows.length; i++) {
     var unitPrice = rows[i].querySelector('input[name="unitPrice"]').value;
     grandTotal += parseFloat(unitPrice) || 0;
    }
    document.getElementById('grandTotal').value = grandTotal;
    calculatePendingAmount();
}

function calculatePendingAmount() {
    const abono = parseFloat(document.querySelector('input[name="deposit"]').value) || 0;
    const totalGeneral = parseFloat(document.getElementById('grandTotal').value) || 0;
    const valorPendiente = totalGeneral - abono;
    document.getElementById('pendingAmount').value = valorPendiente.toFixed(2);
}

document.getElementById('addRow').addEventListener('click', function() {
    var table = document.getElementById('productTable');
    var newRow = table.insertRow();
    for (var i = 0; i < 3; i++) {
     var newCell = newRow.insertCell(i);
     if (i === 1) {
      var select = document.createElement('select');
      select.className = 'border border-gray-300 p-2 w-full text-center';
      select.name = 'description';
      var option1 = document.createElement('option');
      option1.value = 'Producto 1';
      option1.text = 'Producto 1';
      var option2 = document.createElement('option');
      option2.value = 'Producto 2';
      option2.text = 'Producto 2';
      var option3 = document.createElement('option');
      option3.value = 'Producto 3';
      option3.text = 'Producto 3';
      select.appendChild(option1);
      select.appendChild(option2);
      select.appendChild(option3);
      newCell.appendChild(select);
     } else {
      var input = document.createElement('input');
      input.type = 'number';
      input.className = 'border border-gray-300 p-2 w-full text-center';
      input.name = i === 0 ? 'quantity' : 'unitPrice';
      input.oninput = function() {
       calculateTotal();
      };
      newCell.appendChild(input);
     }
    }
});

document.getElementById('printButton').addEventListener('click', function() {
    window.print();
});


document.addEventListener('DOMContentLoaded', function() {
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('deliveryDate').value = today;
});

document.getElementById('shareButton').addEventListener('click', function() {
    html2canvas(document.getElementById('orderContainer')).then(function(canvas) {
        var imgData = canvas.toDataURL('image/png');
        var pdf = new jsPDF('p', 'mm', 'a4');
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        var pdfBlob = pdf.output('blob');
        var formData = new FormData();
        formData.append('file', pdfBlob, 'boleta.pdf');

        // Upload the PDF to a cloud storage service and get the link
        fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            var pdfUrl = data.secure_url;
            var whatsappUrl = `https://wa.me/?text=Here%20is%20your%20order%20receipt:%20${encodeURIComponent(pdfUrl)}`;
            window.open(whatsappUrl, '_blank');
        })
        .catch(error => {
            console.error('Error uploading PDF:', error);
        });
    });
});