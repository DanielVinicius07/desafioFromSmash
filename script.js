function upload() {
    const fileInput = document.getElementById("uploadInput");
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
  
    const maxSize = 5 * 1024 * 1024; // 5MB
  
    for (let file of fileInput.files) {
      if (file.size > maxSize) {
        resultDiv.innerHTML = "❌ Arquivo ultrapassa o limite de 5MB!";
        return;
      }
    }
  
    const su = new SmashUploader({
      region: "eu-west-3",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM2YTUyMDFiLTUxMjItNDgwZC05YzRhLTQ0YWEzODdiNDg4MC1ldSIsInVzZXJuYW1lIjoiNzZhNWViOTctZWNiNy00MmNiLTk5MjUtMjFmNDViYzJmMzJlIiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIyMDEuMjAuMTEwLjI0MiIsInNjb3BlIjoiTm9uZSIsImFjY291bnQiOiJhMTFkZTllYy1kMjM3LTQ2ODEtOTY0NS03OTViMDA4ZjM0ZDUtZWEiLCJpYXQiOjE3NDYwNDkxMjEsImV4cCI6NDkwMTgwOTEyMX0.4Pn0ucwaezK4aEY3oWK2M9y-_Sb68WydEg6SrlMBYGA" // ⚠️ Substitua pela sua chave real
    });
  
    su.upload({ files: [...fileInput.files] })
        .then(transfer => {
            console.log("Transfer", transfer);
        
            if (transfer && transfer.smash && transfer.smash.link) {
            const link = transfer.smash.link;
        
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=Link do arquivo Smash&body=${encodeURIComponent(link)}`;
        
            resultDiv.innerHTML = `
                ✅ Enviado com sucesso!<br>
                <a href="${link}" target="_blank" class="underline text-blue-500 block mt-2">Acesse seu arquivo aqui</a>
                <a href="${gmailLink}" target="_blank" class="btn btn-sm btn-outline btn-success mt-3">Abrir Gmail com o link</a>
            `;
            } else {
            resultDiv.innerHTML = "❌ Upload feito, mas o link não pôde ser recuperado.";
            console.error("Resposta inesperada:", transfer);
            }
        })
      .catch(error => {
        console.error("Erro no upload", error);
        resultDiv.innerHTML = "❌ Ocorreu um erro no upload.";
      });
  
    su.on("progress", event => {
        if (event.data && event.data.progress && event.data.progress.percent !== undefined) {
          console.log(`Progresso: ${event.data.progress.percent.toFixed(2)}%`);
        } else {
          console.log("Evento de progresso sem percent:", event);
        }
      });
  }