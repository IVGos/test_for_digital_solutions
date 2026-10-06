export function createBatcher(intervalTime: number) {
  let queue: Array<() => void> = [];

  // ключ запроса
  let pendingKey = new Map<string, Promise<unknown>>();

  setInterval(() => {
    const batch = queue;
    queue = [];
    pendingKey = new Map();
    for (const i of batch) {
      i();
    }
  }, intervalTime);

  function putTaskToQueue<T>(
    key: string,
    run: () => T,
    mutate: boolean,
  ): Promise<T> {
    // отдаем запрос в промис
    const existing = pendingKey.get(key);
    if (existing) return existing as Promise<T>;
    // если изменился, то сбрасываем ключи
    if (mutate) {
      pendingKey = new Map();
    }
    const promise = new Promise<T>((resolve, reject) => {
      queue.push(() => {
        try {
          resolve(run());
        } catch (e) {
          reject(e);
        }
      });
    });
    pendingKey.set(key, promise);
    return promise;
  }
  return { putTaskToQueue };
}
