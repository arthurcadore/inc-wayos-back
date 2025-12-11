/**
 * @description Função de delay, usar apenas em testes
 * @param ms Tempo em milissegundos para o delay
 * @returns Promise que resolve após o tempo especificado
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
