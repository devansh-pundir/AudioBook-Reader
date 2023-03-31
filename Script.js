// Targeting Video Element
const video = document.querySelector("video")

// Trageting Text Element
const textElement = document.querySelector("[data-text]")

// Rendering Video On Web
const setup = async () => {
    video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true })

    video.addEventListener("playing", async () => {
        const worker = Tesseract.createWorker();
        await worker.load();
        await worker.loadLanguage("eng")
        await worker.initialize("eng")

        const canvas = document.createElement("canvas")
        canvas.height = video.height;
        canvas.width = video.width;

        document.addEventListener("keypress", async (event) => {
            if (event.code !== "Space") {
                return;
            }
            canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height)
            const { data: { text } } = await worker.recognize(canvas)

            // Speech API Call
            speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\s/g, " ")))

            textElement.textContent = text
        })
    })
}

setup();