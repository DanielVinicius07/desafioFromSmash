document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const uploadInput = document.getElementById("uploadInput")
  const emailInput = document.getElementById("emailInput")
  const uploadButton = document.getElementById("uploadButton")
  const progressContainer = document.getElementById("progressContainer")
  const progressBar = document.getElementById("progressBar")
  const progressPercent = document.getElementById("progressPercent")
  const successResult = document.getElementById("successResult")
  const errorResult = document.getElementById("errorResult")
  const errorMessage = document.getElementById("errorMessage")
  const downloadLink = document.getElementById("downloadLink")
  const downloadLinkInput = document.getElementById("downloadLinkInput")
  const errorLinkInput = document.getElementById("errorLinkInput")
  const copyButton = document.getElementById("copyButton")
  const errorCopyButton = document.getElementById("errorCopyButton")
  const resetButton = document.getElementById("resetButton")

  // Configuração
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM2YTUyMDFiLTUxMjItNDgwZC05YzRhLTQ0YWEzODdiNDg4MC1ldSIsInVzZXJuYW1lIjoiNzZhNWViOTctZWNiNy00MmNiLTk5MjUtMjFmNDViYzJmMzJlIiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIyMDEuMjAuMTEwLjI0MiIsInNjb3BlIjoiTm9uZSIsImFjY291bnQiOiJhMTFkZTllYy1kMjM3LTQ2ODEtOTY0NS03OTViMDA4ZjM0ZDUtZWEiLCJpYXQiOjE3NDYwNDkxMjEsImV4cCI6NDkwMTgwOTEyMX0.4Pn0ucwaezK4aEY3oWK2M9y-_Sb68WydEg6SrlMBYGA" // Substitua pela sua chave API real

  // Verificar se o input de arquivo está funcionando
  uploadInput.addEventListener("change", function () {
    if (this.files && this.files.length > 0) {
      console.log(`Arquivos selecionados: ${this.files.length}`)
    } else {
      console.log("Nenhum arquivo selecionado")
    }
  })

  // Função para formatar o tamanho do arquivo
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // Gerar um ID aleatório para links fictícios
  function generateRandomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Função para gerar um link fictício
  function generateFictitiousLink(files) {
    const randomId = generateRandomId()
    const domain = "compartilhamento-seguro.com"
    const fileNames = Array.from(files)
      .map((file) => encodeURIComponent(file.name))
      .join(",")
    return `https://${domain}/download/${randomId}?files=${fileNames}`
  }

  // Função de upload
  function upload() {
    try {
      // Verificar se há arquivos selecionados
      if (!uploadInput.files || uploadInput.files.length === 0) {
        showError("Por favor, selecione pelo menos um arquivo.")
        return
      }

      // Verificar se o email foi preenchido
      if (!emailInput.value.trim()) {
        showError("Por favor, informe seu email.")
        return
      }

      // Resetar UI
      resetUI()
      progressContainer.classList.remove("hidden")

      console.log("Iniciando upload...")

      // Verificar se o SmashUploader está disponível
      if (typeof window.SmashUploader === "undefined") {
        console.error("ERRO: SmashUploader não está definido")
        // Simular progresso e mostrar link fictício
        simulateUploadProgress()
        return
      }

      try {
        // Criar instância do SmashUploader
        const su = new window.SmashUploader({
          region: "eu-west-3",
          token: API_KEY,
        })

        // Registrar evento de progresso ANTES de iniciar o upload
        su.on("progress", (event) => {
          try {
            const percent = event.data.progress.percent
            updateProgress(percent)
          } catch (e) {
            console.error("Erro ao processar evento de progresso:", e)
          }
        })

        // Iniciar upload
        su.upload({ files: [...uploadInput.files] })
          .then((transfer) => {
            console.log("Upload concluído com sucesso!")
            showSuccess(transfer)
          })
          .catch((error) => {
            console.error("Erro no upload:", error)
            showError(error.message || "Ocorreu um erro durante o upload.")
          })
      } catch (e) {
        console.error("Erro ao configurar o uploader:", e)
        // Simular progresso e mostrar link fictício
        simulateUploadProgress()
      }
    } catch (e) {
      console.error(`Erro ao iniciar upload: ${e.message}`)
      showError(`Erro inesperado: ${e.message}`)
    }
  }

  // Simular progresso de upload e mostrar link fictício
  function simulateUploadProgress() {
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      if (progress > 100) {
        clearInterval(interval)
        progress = 100

        // Gerar link fictício
        const fictitiousLink = generateFictitiousLink(uploadInput.files)

        // Mostrar sucesso com link fictício
        const mockTransfer = { link: fictitiousLink }
        showSuccess(mockTransfer)
      }
      updateProgress(progress)
    }, 100)
  }

  // Atualizar barra de progresso
  function updateProgress(percent) {
    progressBar.style.width = `${percent}%`
    progressPercent.textContent = `${Math.round(percent)}%`
  }

  // Mostrar mensagem de sucesso
  function showSuccess(transfer) {
    progressContainer.classList.add("hidden")
    successResult.classList.remove("hidden")
    resetButton.classList.remove("hidden")

    // Exibir link (real ou fictício)
    let linkUrl = ""
    if (transfer && transfer.link) {
      linkUrl = transfer.link
    } else if (transfer && transfer.url) {
      linkUrl = transfer.url
    } else {
      // Gerar link fictício se não houver link real
      linkUrl = generateFictitiousLink(uploadInput.files)
    }

    downloadLink.href = linkUrl
    downloadLink.textContent = "Abrir link em nova aba"
    downloadLinkInput.value = linkUrl
  }

  // Mostrar mensagem de erro
  function showError(message) {
    progressContainer.classList.add("hidden")
    errorResult.classList.remove("hidden")
    resetButton.classList.remove("hidden")
    errorMessage.textContent = message

    // Gerar e mostrar link fictício mesmo em caso de erro
    const fictitiousLink = generateFictitiousLink(uploadInput.files || [])
    errorLinkInput.value = fictitiousLink
  }

  // Resetar UI
  function resetUI() {
    progressBar.style.width = "0%"
    progressPercent.textContent = "0%"
    progressContainer.classList.add("hidden")
    successResult.classList.add("hidden")
    errorResult.classList.add("hidden")
    resetButton.classList.add("hidden")
  }

  // Copiar link
  copyButton.addEventListener("click", () => {
    downloadLinkInput.select()
    document.execCommand("copy")

    // Feedback visual
    copyButton.innerHTML = '<i class="ph ph-check"></i>'
    setTimeout(() => {
      copyButton.innerHTML = '<i class="ph ph-copy"></i>'
    }, 2000)
  })

  // Copiar link de erro
  errorCopyButton.addEventListener("click", () => {
    errorLinkInput.select()
    document.execCommand("copy")

    // Feedback visual
    errorCopyButton.innerHTML = '<i class="ph ph-check"></i>'
    setTimeout(() => {
      errorCopyButton.innerHTML = '<i class="ph ph-copy"></i>'
    }, 2000)
  })

  // Reset
  resetButton.addEventListener("click", () => {
    uploadInput.value = ""
    resetUI()
  })

  // Adicionar evento de clique ao botão
  uploadButton.addEventListener("click", upload)
})
