export const playNotificationSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "triangle";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // Quick sweep up to C6
    osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.4); // Down to C5

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.05); // Faster attack
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5); // Decay

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
};
