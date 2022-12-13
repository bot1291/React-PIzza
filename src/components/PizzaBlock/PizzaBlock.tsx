import styles from './PizzaBlock.module.scss';
import { PizzaBlockProps } from './PizzaBlock.props';
import cn from 'classnames';
import { FC, useState } from 'react';
import { AddButton } from '../AddButton/AddButton';
import { UlSizes } from '../UlSizes/UlSizes';
import { UlDough } from '../UlDough/UlDough';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { pizzasSlice } from '../../store/reducers/PizzasSlice';
import { IChosenPizza } from '../../interfaces/IChosenPizza';
import { IPizza } from '../../interfaces/IPizza';
import { pizzaSortSlice } from '../../store/reducers/PizzaSortSlice';

export const PizzaBlock: FC<PizzaBlockProps> = ({
	title,
	sizesAndPrices,
	possibleDoughs,
	image,
	defaultDough = possibleDoughs[0] || '',
	defaultSize = sizesAndPrices.map((s) => s.size)[0] || '',
	className,
	...props
}) => {
	const [dough, setDough] = useState<string>(defaultDough);
	const [size, setSize] = useState<string>(defaultSize);
	const [count, setCount] = useState<number>(1);
	const dispatch = useAppDispatch();
	const { setParam } = pizzaSortSlice.actions;
	const { addPizza, reloadPizzas } = pizzasSlice.actions;
	const { pizzas } = useAppSelector((state) => state.pizzaSortReducer);
	const copiedWithoutFlagsPizzas: IPizza[] = JSON.parse(
		JSON.stringify(pizzas)
	);

	const setPizzaParams = () => {
		setCount(1);
		const chosenPizza: IChosenPizza = {
			dough,
			title,
			count,
			size,
			image,
			price: findDependencyBetweenSizeAndPrice(),
		};

		if (!localStorage.chosenPizzas) {
			localStorage.chosenPizzas = JSON.stringify([chosenPizza]);
			dispatch(addPizza(chosenPizza));
			console.log(JSON.parse(localStorage.chosenPizzas), 1);
			return;
		}

		const allPizzas: IChosenPizza[] = JSON.parse(localStorage.chosenPizzas);
		const currentPizza = allPizzas.find(
			(p) => p.title === title && p.dough === dough && p.size === size
		);
		if (currentPizza) {
			allPizzas.map((p) => {
				if (p.title === title && p.dough === dough && p.size === size) {
					p.count = p.count + count;
					return p;
				}
				return p;
			});
			dispatch(reloadPizzas(allPizzas));
			localStorage.chosenPizzas = JSON.stringify(allPizzas);
			console.log(JSON.parse(localStorage.chosenPizzas), 2);
			return;
		}

		dispatch(addPizza(chosenPizza));
		localStorage.chosenPizzas = JSON.stringify([...allPizzas, chosenPizza]);
		console.log(JSON.parse(localStorage.chosenPizzas), 3);
	};

	const handlerSetCount = (inctremOrDecrem: string) => {
		if (inctremOrDecrem === 'increment') {
			setCount(count + 1);
		}
		if (inctremOrDecrem === 'decrement') {
			setCount(count !== 1 ? count - 1 : 1);
		}
	};

	const handlerSetDough = (currentDough: string) => {
		setDough(currentDough);
		const correctedPizzas = copiedWithoutFlagsPizzas.map((p) => {
			if (p.title === title) {
				return { ...p, dough: currentDough };
			}
			return p;
		});
		dispatch(setParam(correctedPizzas));
		localStorage.pizzas = JSON.stringify(correctedPizzas);
	};

	const handlerSetSize = (currentSize: string) => {
		setSize(currentSize);
		const correctedPizzas = copiedWithoutFlagsPizzas.map((p) => {
			if (p.title === title) {
				return {
					...p,
					size: currentSize,
				};
			}
			return p;
		});
		dispatch(setParam(correctedPizzas));
		localStorage.pizzas = JSON.stringify(correctedPizzas);
	};

	const findDependencyBetweenSizeAndPrice = (): number => {
		const currentDependency = sizesAndPrices.find((s) => s.size === size);
		if (currentDependency) {
			return currentDependency.price;
		}
		return 0;
	};

	return (
		<div className={cn(className, styles.pizzaBlock)} {...props}>
			<img className={cn(styles.image)} src={image} alt={title} />
			<h4 className={cn(styles.title)}>{title}</h4>
			<div className={cn(styles.selector)}>
				<UlDough
					setDough={handlerSetDough}
					allDoughs={possibleDoughs}
					currentDough={dough}
				/>
				<UlSizes
					setSize={handlerSetSize}
					allSizes={sizesAndPrices.map((s) => s.size)}
					currentSize={size}
				/>
			</div>
			<div className={cn(styles.info)}>
				<div className={cn(styles.price)}>
					<span
						className={cn(styles.amountCost, {
							[styles.visibleAmount]: count > 1,
						})}>
						Общая цена
					</span>
					{count > 1
						? findDependencyBetweenSizeAndPrice() * count
						: findDependencyBetweenSizeAndPrice()}
					₽
				</div>
				<AddButton
					onClick={setPizzaParams}
					count={count}
					setCount={handlerSetCount}
				/>
			</div>
		</div>
	);
};
