document.addEventListener('DOMContentLoaded', () => {
    const fraseElement = document.getElementById('fraseVovo');
    if (fraseElement) {
        const frase = fraseElement.textContent;
        const utterance = new SpeechSynthesisUtterance(frase);
        utterance.lang = 'pt-BR'; // Define o idioma para português do Brasil

        // Opcional: Ajustar a voz e a velocidade
        // speechSynthesis.getVoices().then(voices => {
        //     const selectedVoice = voices.find(voice => voice.lang === 'pt-BR' && voice.name.includes('Google português do Brasil'));
        //     if (selectedVoice) {
        //         utterance.voice = selectedVoice;
        //     }
        // });
        utterance.rate = 1.0; // Velocidade da fala (1.0 é normal)
        utterance.pitch = 1.0; // Tom da fala (1.0 é normal)

        window.speechSynthesis.speak(utterance);
    }
});