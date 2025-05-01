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
      token: "SUA_API_KEY_AQUI" // ⚠️ Substitua pela sua chave real
    });
  
    su.upload({ files: [...fileInput.files] })
      .then(transfer => {
        console.log("Transfer", transfer);
        const link = transfer.smash.link;
        resultDiv.innerHTML = `✅ Enviado! <a href="${link}" target="_blank" class="underline text-blue-500">Acesse seu arquivo aqui</a>`;
      })
      .catch(error => {
        console.error("Erro no upload", error);
        resultDiv.innerHTML = "❌ Ocorreu um erro no upload.";
      });
  
    su.on("progress", event => {
      console.log(`Progresso: ${event.data.progress.percent.toFixed(2)}%`);
    });
  }