export const useSessionStorage = (key) => {
  const setItem = (value) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return "";
    } catch (error) {
      console.log("%c  error:", "color: #0e93e0;background: #aaefe5;", error);
    }
  };

  const getItem = () => {
    try {
      const item = window.sessionStorage.getItem(key);

      return item;
    } catch (error) {
      console.log("%c  error:", "color: #0e93e0;background: #aaefe5;", error);
    }
  };

  const removeItem = () => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.log("%c  error:", "color: #0e93e0;background: #aaefe5;", error);
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
  };
};
