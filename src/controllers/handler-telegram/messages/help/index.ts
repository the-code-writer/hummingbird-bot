const helpMessage = () => {
    const helpText: string = `
    # Solana Wallet Watcher Bot Help

    Welcome to the Solana Wallet Watcher Bot! Here are the commands you can use to interact with your Solana wallets:

    ---

    🔍 /watch [wallet_address]  
    _Start monitoring a Solana wallet for any transactions or activities._

    📊 /activity [wallet_address]  
    _Get a summary of recent activities for the specified wallet._

    💰 /transactions [wallet_address]  
    _List the latest transactions made by the wallet._

    🤝 /contract_interactions [wallet_address]  
    _View interactions with smart contracts from the wallet._

    🆕 /create_wallet  
    _Generate a new Solana wallet and manage it through this bot._

    🔑 /wallet_info [wallet_address]  
    _Display detailed information about the wallet, including balance._

    📈 /portfolio [wallet_address]  
    _Analyze and show the current portfolio of tokens in the wallet._

    ⚙️ /set_alert [wallet_address] [threshold]  
    _Set custom alerts for transactions above a certain threshold (in SOL)._

    🔔 /list_alerts  
    _Show all active alerts you've set for your wallets._

    ❌ /remove_alert [alert_id]  
    _Remove an alert using its ID._

    📋 /list_wallets  
    _List all wallets you are currently monitoring._

    ⏹️ /stop_watching [wallet_address]  
    _Stop monitoring a specific wallet._

    🔄 /refresh [wallet_address]  
    _Force an immediate update of the wallet data._

    ❓ /help  
    _Display this help message._

    📜 /about  
    _Learn more about the bot and its capabilities._

    ---

    **Note:** Replace [wallet_address] with the actual address of the Solana wallet you want to interact with. For commands with thresholds, use numbers (e.g., 10 for 10 SOL).

    If you encounter any issues or need further assistance, feel free to contact the bot administrator or use the /feedback command if available.
    `;

    return helpText;
}

export default helpMessage;