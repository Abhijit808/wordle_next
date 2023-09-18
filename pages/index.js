import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { useState, useEffect } from "react";
import { BsFillBackspaceFill } from "react-icons/bs";
export default function Home() {
  const [word, setword] = useState("");
  const [chance, setchance] = useState(0);
  const [guess, setguess] = useState(Array(6).fill(""));
  const [correct, setcorrect] = useState("");
  const keyboard = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  useEffect(() => {
    const get_Word = async () => {
      const data = await fetch("/api/words");
      const result = await data.json();
      // console.log(result.random);
      setcorrect(result.random);
    };
    get_Word();
  }, []);

  useEffect(() => {
    const handlekeyup = (e) => {
      if (word.length > 5) {
        alert("please check word.lenght");
        setword("");
        return;
      }

      if (e.key === "Backspace") {
        setword((prev) => prev.slice(0, -1));
        return;
      }
      if (e.key === "Enter") {
        if (word.length < 5) {
          return;
        }
        if (word === correct) {
          alert("you won");
          location.reload();
          return;
        }
        if (chance >= 5) {
          setchance(0);
          alert("you loose");
          location.reload();
          return;
        }
        // console.log(word);
        const newguess = [...guess];
        newguess[guess.findIndex((index) => index == "")] = word;
        setguess(newguess);
        setchance((prev) => prev + 1);
        setword("");
        return;
      }

      if (chance > 6) {
        setchance(0);
        alert("you loose");
        location.reload();
        return;
      }

      if (!e.key.match(/^[A-z]$/)) {
        alert("please enter the coorect word");
        return;
      }

      setword((prev) => prev + e.key);
    };
    window.addEventListener("keyup", handlekeyup);
    return () => {
      window.removeEventListener("keyup", handlekeyup);
    };
  }, [chance, word, guess]);
  const handlekeyboardclick = (e) => {
    setword((prev) => prev + e.target.innerText);
    console.log(e.target.innerText);
  };
  const handleValidate = (e) => {
    if (word.length > 5) {
      alert("please check word.lenght");
      setword("");
      return;
    }
    console.log(e.target.id);
    if (e.target.id === "Backspace") {
      // console.log("here");
      setword((prev) => prev.slice(0, -1));
      return;
    }
    if (e.target.innerText === "Enter") {
      if (word.length < 5) {
        return;
      }
      if (word === correct) {
        alert("you won");
        location.reload();
        return;
      }
      if (chance >= 5) {
        setchance(0);
        alert("you loose");
        location.reload();
        return;
      }
      // console.log(word);
      const newguess = [...guess];
      newguess[guess.findIndex((index) => index == "")] = word;
      setguess(newguess);
      setchance((prev) => prev + 1);
      setword("");
      return;
    }

    if (chance > 6) {
      setchance(0);
      alert("you loose");
      location.reload();
      return;
    }
  };
  return (
    <>
      <Head>
        <title>Wordle</title>
      </Head>
      <div className={styles.flex}>
        <div className={styles.center}>
          <h1 className={styles.text}>WORDLE</h1>
          <h3 className={styles.text}>Attemts remaing {7 - (chance + 1)}</h3>

          {guess.map((guess, index) => {
            const i = chance === index;
            const g = guess == null;
            const prev_word = ["", "", "", "", ""];
            for (let index = 0; index < guess.length; index++) {
              prev_word[i] = guess[i];
            }
            return (
              <main className={styles.main} key={index}>
                {prev_word.map((_, index) => {
                  const style =
                    word[index] === correct[index] ? styles.green : styles.red;
                  const g_style =
                    guess[index] === correct[index] ? styles.green : styles.red;
                  return (
                    <h1
                      key={index}
                      className={`${styles.letter} ${i ? style : g_style}`}
                    >
                      {i && word[index]}
                      {guess[index]}
                    </h1>
                  );
                })}
              </main>
            );
          })}
        </div>
        <div className={styles.K_wrapper}>
          {keyboard.map((keys, index) => {
            return (
              <div className={styles.K_layout} key={index}>
                {keys.split("").map((l, index) => {
                  // const style = word[index] === "" && styles.green;
                  // const g_style = guess[index] === correct[index] ? styles.green : styles.red
                  return (
                    <p
                      className={`${styles.lay}`}
                      key={index}
                      onClick={(e) => handlekeyboardclick(e)}
                    >
                      {l}
                    </p>
                  );
                })}
                {index === 1 && (
                  <p
                    className={`${styles.Hot}`}
                    onClick={(e) => handleValidate(e)}
                  >
                    Enter
                  </p>
                )}
                {index === 0 && (
                  <p
                    className={`${styles.Hot}`}
                    id="Backspace"
                    onClick={(e) => handleValidate(e)}
                  >
                    <BsFillBackspaceFill />
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
