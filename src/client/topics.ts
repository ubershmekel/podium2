// This file contains the topics for discussion

const topicsText = `Prostitution	Prostitution should be legal	Prostitution should be illegal	Ethics
Death Penalty	I'm for a death penalty	I'm against a death penalty	Ethics
Donald Trump	I like Donald Trump	I don't like Donald Trump	Politics
Las Vegas is a...	nice city	nasty city	Geo
Gambling	Gambling is good	Gambling is evil	Ethics
Covid Vaccine	We should get vaccinated against covid	We should not get vaccinated against covid	Health
Jogging	Jogging is good	Jogging is bad	Health
...	Carbohydrates are good	Carbohydrates are bad	Health
Better to die by...	fire	drowning	Health
...	Democracy is good	Democracy is bad	Ethics
Put all your savings in	the stock market	real estate	Finance
...	Buying at a thrift shop is the best	Buying at a thrift shop is the worst	Finance
...	Being unemployed is great	Being unemployed sucks	Finance
Climate change...	is important	is not important	Science
Animal Experimentation	is good	is bad	Ethics
Vegetarianism	Vegetarianism is good	Vegetarianism is bad	Ethics
Porn	Porn is good	Porn is bad	Ethics
Being a kid is...	great	sucks	Silly
Better to brush your teeth with...	Hand	Toilet brush	Silly
Better wipe your poop with...	Hand	Toilet brush	Silly
Who would win in a fight? 	100 horses the size of a duck	1 duck the size of a horse	Silly
Jesus would have loved	basketball	baseball	Silly
You travel back in time to	kill hitler	see dinosaurs	Silly
Who would win in a fight?	Michael Jackson	100 six year olds	Silly
What feels better?	Peeing	Pooping	Silly
Which is sexier?	Feet	Hands	Silly
Which is better?	Cash	Credit card	Silly
The best utensil is...	Spoon	Fork	Silly
Better to lick..	Barbershop floor	Hospital floor	Silly
Who would win in a fight?	Harry Potter	The Terminator	Silly
Which tastes better?	Ketchup	Mayo	Silly
Which is better?	Pizza	Hamburger	Silly
Which is worse?	Sand	Insects	Silly
Which is worse?	Seafood	Lettuce	Silly
Better to lose just...	One eye	Two ears	Silly
Google is...	Evil	Good	Finance`

export interface Discussion {
  id: string;
  title: string;
  answerA: string;
  answerB: string;
  category: string;
}

export function parseTopics(): Discussion[] {
  const topics: Discussion[] = [];
  let i = 0;
  for (let line of topicsText.split('\n')) {
    const [title, answerA, answerB, category] = line.split('\t');
    const discussion = {
      id: "" + i,
      title,
      answerA,
      answerB,
      category,
    };
    topics.push(discussion);
    i += 1;
  }
  return topics;
}

