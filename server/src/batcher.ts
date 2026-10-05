export function createBatcher(intervalTime: number) {
  let queue: Array<() => void> = [];

  setInterval(() => {
    const batch = queue;
    queue = [];
    for (const i of batch) {
      i();
    }
  }, intervalTime);

  function putTaskToQueue<T>(run: () => T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      queue.push(() => {
        try {
          resolve(run());
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  return { putTaskToQueue };
}
