import React, {useState} from 'react';

const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

export const ThemeContext = React.createContext(themes.light);

export const ThemeProvider = ({ children }) => {

	const [theme, setTheme] = useState(themes.light);
	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};
	const color = theme === theme.foreground
	const backgroundColor = theme.background

	document.body.style.color = color;
	document.body.style.backgroundColor = backgroundColor;

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export default ThemeProvider