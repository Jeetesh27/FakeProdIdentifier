App = {
    web3Provider: null,
    contracts: {},

    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: async function() {
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // This will force the popup even if previously connected
                await window.ethereum.request({ 
                    method: 'wallet_requestPermissions',
                    params: [{ eth_accounts: {} }]
                });
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (error) {
                console.error("User denied account access");
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to local provider
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        
        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: async function() {
        try {
            // Load contract data
            const response = await fetch('product.json');
            const productArtifact = await response.json();
            
            App.contracts.product = TruffleContract(productArtifact);
            App.contracts.product.setProvider(App.web3Provider);
            
            return App.bindEvents();
        } catch (error) {
            console.error("Error loading contract:", error);
        }
    },

    bindEvents: function() {
        $(document).on('click', '.btn-register', App.registerProduct);
    },

    registerProduct: async function(event) {
        event.preventDefault();

        try {
            const manufacturerID = document.getElementById('manufacturerID').value;
            const productName = document.getElementById('productName').value;
            const productSN = document.getElementById('productSN').value;
            const productBrand = document.getElementById('productBrand').value;
            const productPrice = document.getElementById('productPrice').value;

            // Get accounts
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });

            const account = accounts[0];
            
            // Get contract instance
            const productInstance = await App.contracts.product.deployed();
            

            
            // Send transaction
            await productInstance.addProduct(
                manufacturerID,
                productName,
                productSN,
                productBrand,
                productPrice,
                { from: account }
            );
            
            // Clear form
            document.getElementById('manufacturerID').value = '';
            document.getElementById('productName').value = '';
            document.getElementById('productSN').value = '';
            document.getElementById('productBrand').value = '';
            document.getElementById('productPrice').value = '';
            
            console.log("Product registered successfully!");
        } catch (err) {
            console.error("Error registering product:", err);
        }
    }
};

$(function() {
    $(window).on('load', function() {
        App.init();
    });
});