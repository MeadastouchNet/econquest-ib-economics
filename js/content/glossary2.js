// Destinations point to the card that introduces each term in Unit 2.
const groups = [
['2.1',0,[
['demand','The quantities consumers are willing and able to buy at different prices over a stated period.'],
['law of demand','Other things equal, a higher own price generally reduces quantity demanded.']]],
['2.1',1,[
['substitute','A good that can be used in place of another good.'],
['complement','A good used together with another good.']]],
['2.1',2,[['market demand','The horizontal sum of individual quantities demanded at each price over the same period.']]],
['2.1',3,[
['diminishing marginal utility','Successive additional units tend to provide smaller extra satisfaction.'],
['substitution effect','A price change alters a good’s relative price, encouraging switching towards relatively cheaper alternatives.'],
['income effect','A price change alters the purchasing power of a given money income.']]],
['2.2',0,[
['supply','The quantities producers are willing and able to offer at different prices over a stated period.'],
['law of supply','Other things equal, a higher own price generally increases quantity supplied.']]],
['2.2',1,[
['joint supply','A production relationship in which goods arise together from the same process.'],
['competitive supply','A relationship in which products compete for the same productive resources.']]],
['2.2',2,[['market supply','The horizontal sum of producers’ quantities supplied at each price over the same period.']]],
['2.2',3,[
['diminishing marginal returns','Adding a variable input to fixed inputs eventually yields smaller additional output, other things equal.'],
['marginal cost','The change in total cost per additional unit of output.']]],
['2.3',0,[
['market equilibrium','A situation in which quantity demanded equals quantity supplied.'],
['excess demand','A shortage: quantity demanded exceeds quantity supplied at the current price.'],
['excess supply','A surplus: quantity supplied exceeds quantity demanded at the current price.']]],
['2.3',1,[['price mechanism','Price changes signal scarcity, create incentives and ration output among buyers willing and able to pay.']]],
['2.3',2,[
['consumer surplus','Total willingness to pay above the prices actually paid for the units purchased.'],
['producer surplus','Revenue above the minimum supply prices for the units sold; it is not identical to profit.'],
['social surplus','Consumer surplus plus producer surplus in the standard market model.'],
['allocative efficiency','An allocation maximising social surplus, with marginal social benefit equal to marginal social cost.']]],
['2.4',0,[
['rational consumer choice','A model in which consumers make consistent, informed choices to maximise utility within their budget.'],
['bounded rationality','Limits to information, time or processing capacity constrain fully optimising decisions.'],
['bounded self-control','Difficulty following longer-term intentions when faced with immediate temptations.'],
['bounded selfishness','The recognition that fairness and the welfare of others can affect choices.']]],
['2.4',1,[
['rule of thumb','A simplifying decision shortcut rather than a full calculation.'],
['anchoring','Giving an initial reference point disproportionate influence in a judgement.'],
['framing','A change in choices caused by how otherwise equivalent information or options are presented.'],
['availability bias','Giving easily recalled or vivid information disproportionate weight in a judgement.']]],
['2.4',2,[
['choice architecture','The design and presentation of the setting in which people choose.'],
['default','The option applied if a person does not actively choose otherwise.'],
['nudge','A predictable change to behaviour through choice design that preserves options and avoids large changes in financial incentives.'],
['restricted choice','A choice setting in which some options are removed.'],
['mandated choice','A choice setting requiring an active selection rather than relying on a default.']]],
['2.4',3,[
['profit maximisation','Choosing the feasible output or strategy yielding the largest difference between revenue and economic cost.'],
['market share','A firm’s sales as a proportion of total sales in its defined market, measured consistently by value or volume.'],
['satisficing','Seeking a satisfactory target rather than the greatest possible outcome.'],
['corporate social responsibility','Considering wider social and environmental effects of business decisions.']]],
['2.5a',0,[
['price elasticity of demand','The percentage change in quantity demanded divided by the percentage change in price.'],
['price elastic demand','Demand whose percentage quantity response exceeds the percentage price change in magnitude.'],
['price inelastic demand','Demand whose percentage quantity response is smaller than the percentage price change in magnitude.'],
['unit elastic demand','Demand with a price-elasticity magnitude of one.']]],
['2.5a',2,[['total revenue','The total receipts from sales; with a single selling price, price multiplied by quantity sold.']]],
['2.5b',0,[
['income elasticity of demand','The percentage change in quantity demanded divided by the percentage change in income, other relevant things equal.'],
['normal good','A good with positive income elasticity: demand rises when income rises, other things equal.'],
['inferior good','A good with negative income elasticity: demand falls when income rises, other things equal.']]],
['2.5b',1,[
['necessity','In the YED classification, a normal good with income elasticity between zero and one.'],
['luxury','In the YED classification, a normal good with income elasticity greater than one.']]],
['2.5b',2,[['Engel curve','A curve showing the relationship between consumer income and quantity demanded, holding own price and other determinants fixed.']]],
['2.6',0,[['price elasticity of supply','The percentage change in quantity supplied divided by the percentage change in price.']]],
['2.7a',0,[
['indirect tax','A tax charged on spending on goods or services.'],
['specific tax','A fixed tax amount charged per unit of a good or service.'],
['ad valorem tax','A tax charged as a percentage of a good’s or service’s value.']]],
['2.7a',1,[
['tax incidence','How the economic burden of a tax is divided between buyers and sellers.'],
['welfare loss','A reduction in total social surplus relative to the efficient allocation.']]],
['2.7a',2,[['subsidy','A government payment supporting production or consumption of a good or service.']]],
['2.7b',0,[['price ceiling','A legal maximum price; it binds when below the market-clearing price.']]],
['2.7b',1,[['price floor','A legal minimum price; it binds when above the market-clearing price.']]],
['2.7b',2,[
['regulation','Government rules or standards governing behaviour or production.'],
['direct provision','Government supplying or funding a good or service rather than relying entirely on private market sales.']]],
['2.8a',0,[
['externality','An effect on a third party from production or consumption that is not reflected in the market price.'],
['market failure','A situation in which the market allocates resources inefficiently, reducing potential social surplus.'],
['marginal private cost','The additional cost borne by a producer for one extra unit of output.'],
['marginal social cost','The additional cost to society of one extra unit, including external costs or benefits of production.'],
['marginal private benefit','The additional benefit received by the consumer from one extra unit.'],
['marginal social benefit','The additional benefit to society from one extra unit, including external consumption effects.']]],
['2.8a',1,[
['negative production externality','Third-party harm from production, so marginal social cost exceeds marginal private cost.'],
['negative consumption externality','Third-party harm from consumption, so marginal social benefit is below marginal private benefit.'],
['positive production externality','Third-party benefit from production, so marginal social cost lies below marginal private cost.'],
['positive consumption externality','Third-party benefit from consumption, so marginal social benefit exceeds marginal private benefit.']]],
['2.8a',2,[['corrective tax','A tax intended to internalise external costs by making private decision-makers face more of the social cost.']]],
['2.8b',0,[['common access resource','A rivalrous resource from which excluding users is difficult.']]],
['2.8b',2,[
['tradable permits','Transferable rights to emit or extract a resource under an aggregate limit.'],
['collective self-governance','Users managing a shared resource through agreed rules, monitoring and sanctions.']]],
['2.9',0,[
['public good','A good that is non-rivalrous and non-excludable in the relevant setting.'],
['non-rivalrous','One person’s consumption does not reduce availability for others.'],
['non-excludable','It is difficult to prevent non-payers from benefiting.']]],
['2.9',1,[['free-rider problem','An incentive to benefit without paying that can weaken voluntary funding and cause underprovision.']]],
['2.9',2,[['contracting out','Government paying a private supplier to deliver a publicly financed service.']]],
['2.10',0,[['asymmetric information','One party in a transaction has more relevant information than another.']]],
['2.10',1,[
['adverse selection','Hidden information before contracting can cause higher-risk or lower-quality participants to be disproportionately selected.'],
['moral hazard','Hidden actions or altered incentives after an agreement can encourage greater risk or less care.']]],
['2.10',2,[
['signalling','A better-informed party credibly communicating information about quality or risk.'],
['screening','A less-informed party obtaining information about quality or risk.']]],
['2.11a',0,[
['economic cost','Explicit payments plus implicit opportunity costs of resources used in production.'],
['normal profit','The minimum return needed to keep entrepreneurship in its present use, included in economic cost.'],
['fixed cost','A cost that does not vary with output over the relevant short run.'],
['variable cost','A cost that changes with output.'],
['short run','A production period in which at least one input is fixed.'],
['long run','A production period over which all inputs can vary.']]],
['2.11a',1,[
['average cost','Total cost divided by quantity produced.'],
['average revenue','Total revenue divided by quantity sold; equal to price when all units sell at the same price.'],
['marginal revenue','The change in total revenue per additional unit sold.']]],
['2.11a',2,[['abnormal profit','Revenue exceeding total economic cost, including the normal return to entrepreneurship.']]],
['2.11a',3,[
['economies of scale','Falling long-run average cost as the scale of production increases.'],
['diseconomies of scale','Rising long-run average cost as the scale of production increases.']]],
['2.11b',0,[
['perfect competition','A model with many small firms, homogeneous products, free entry and exit and relevant information; firms take the market price.'],
['price taker','A firm unable to influence the market price.']]],
['2.11b',2,[['monopolistic competition','A market with many differentiated suppliers, relatively free entry and some individual price power.']]],
['2.11c',0,[
['market power','The ability to influence price or other market conditions.'],
['monopoly','A single or dominant supplier in a market with high barriers to entry and no close substitutes.'],
['price maker','A firm with some ability to choose price, constrained by the demand it faces.'],
['barrier to entry','An obstacle making it difficult or costly for new suppliers to enter a market.']]],
['2.11c',2,[['natural monopoly','Cost conditions in which one firm can supply the whole relevant market at lower average cost than several smaller firms.']]],
['2.11d',0,[
['oligopoly','A market dominated by a few interdependent large firms with significant entry barriers.'],
['price competition','Competition through changes in prices or fees.'],
['non-price competition','Competition through features such as quality, service, innovation and advertising.']]],
['2.11d',1,[
['collusion','Cooperation between firms to restrict competition, such as agreeing prices or output.'],
['cartel','A formal agreement among firms to restrict competition.']]],
['2.11d',2,[
['payoff matrix','A table of outcomes for combinations of players’ actions.'],
['dominant strategy','An action yielding a player a better payoff regardless of the rival’s action.'],
['Nash equilibrium','A combination of strategies where neither player can gain by changing their own action alone.']]],
['2.11d',3,[['concentration ratio','The combined market share of the largest specified number of firms in a defined market.']]],
['2.12',0,[
['income','A flow of receipts over a period, including wages, rent, interest and profit.'],
['wealth','A stock of assets minus liabilities at a point in time.']]]
];
export const glossary2 = Object.fromEntries(groups.flatMap(([sec,card,terms])=>terms.map(([key,def])=>[key,{sec,card,def}])));
Object.assign(glossary2['price elasticity of demand'],{aliases:['PED']});
Object.assign(glossary2['income elasticity of demand'],{aliases:['YED']});
Object.assign(glossary2['price elasticity of supply'],{aliases:['PES']});
Object.assign(glossary2['marginal social cost'],{aliases:['MSC']});
Object.assign(glossary2['marginal private benefit'],{aliases:['MPB']});
Object.assign(glossary2['marginal social benefit'],{aliases:['MSB']});
Object.assign(glossary2['welfare loss'],{aliases:['deadweight loss']});
Object.assign(glossary2['common access resource'],{aliases:['common pool resource']});
