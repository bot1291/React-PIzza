import styles from './Allpizzas.module.scss';
import { AllpizzasProps } from './Allpizzas.props';
import cn from 'classnames';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPizzas } from '../../store/slices/ActionCreators';
import { ErrorBlock, PIzzaSkeletonBlock, PizzaBlock } from '..';
import fillWithNumbers from '../../helpers/fillWithNumbers';
import setEnding from '../../helpers/setEnding';

export const Allpizzas: FC<AllpizzasProps> = ({ className, ...props }) => {
	const { pizzas, currentType, searchValue, error, isLoading } =
		useAppSelector((state) => state.pizzaSortReducer);
	const dispatch = useAppDispatch();
	// const pageCount = pizzasBackup.length / 2;

	useEffect(() => {
		dispatch(fetchPizzas());
	}, [dispatch]);

	const handlerLogicalTitle = (): string => {
		if (!pizzas.length) {
			return 'Не найдено';
		}
		if (searchValue) {
			return 'Поиск';
		}
		return setEnding(currentType);
	};

	// const handleSwitchPage = (number: number): void => {
	// 	const newPage = pizzasBackup.slice((number - 1) * 2, number * 2);
	// 	console.log(pizzas);
	// 	dispatch(setParam(newPage));
	// };

	if (error) {
		return <ErrorBlock data-testid="error" />;
	}

	return (
		<div {...props}>
			<h2 data-testid="title" className={styles.title}>
				{isLoading
					? 'Загрузка пицц . . .'
					: `${handlerLogicalTitle()} пиццы`}
			</h2>
			<div className={cn(className, styles.items)}>
				{isLoading
					? fillWithNumbers(8).map((p) => (
							<PIzzaSkeletonBlock
								data-testid="sleketon-wrapper"
								key={p}
							/>
					  ))
					: pizzas.map((p) => (
							<PizzaBlock
								data-testid="pizza-wrapper"
								key={p._id}
								{...p}
							/>
					  ))}
			</div>
			{/* <div className={styles.pages}>
				{fillWithNumbers(Math.ceil(pageCount)).map((page) => (
					<button
						onClick={() => handleSwitchPage(page + 1)}
						key={page}>
						{page + 1}
					</button>
				))}
			</div> */}
		</div>
	);
};
